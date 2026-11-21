import { createHash } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import { fileTypeFromBuffer } from 'file-type';
import { ObjectId, type Db } from 'mongodb';
import type { PhotoStorage } from '../photo-storage.ts';

interface Garment {
  _id: string;
  ownerId: string;
  categoryId: ObjectId;
  imageKey: string;
  contentType: string;
  digest: string;
  ready: boolean;
  createdAt: Date;
}

const maxPhotoBytes = 20 * 1024 * 1024;
const supportedImageTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
  'image/avif',
]);

export function registerItems(app: FastifyInstance, db: Db, ownerId: string, photos: PhotoStorage) {
  const items = db.collection<Garment>('items');

  app.addContentTypeParser(
    'application/octet-stream',
    { parseAs: 'buffer', bodyLimit: maxPhotoBytes },
    (_request, body, done) => done(null, body),
  );

  async function findOwnedCategory(id: string) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    return db
      .collection('categories')
      .findOne({ _id: new ObjectId(id), ownerId }, { projection: { _id: 1 } });
  }

  const categoryItemsRoute = '/categories/:categoryId/items';
  app.get<{ Params: { categoryId: string } }>(categoryItemsRoute, async (request, reply) => {
    const category = await findOwnedCategory(request.params.categoryId);
    if (!category) {
      return reply.code(404).send({ message: 'Category not found.' });
    }

    const records = await items
      .find({ ownerId, categoryId: category._id, ready: true })
      .project({ _id: 1 })
      .sort({ createdAt: -1, _id: 1 })
      .toArray();

    return records.map((record) => ({ id: record._id }));
  });

  app.post<{ Params: { categoryId: string }; Body: Buffer }>(
    categoryItemsRoute,
    { bodyLimit: maxPhotoBytes },
    async (request, reply) => {
      const category = await findOwnedCategory(request.params.categoryId);
      if (!category) {
        return reply.code(404).send({ message: 'Category not found.' });
      }

      const draftId = request.headers['idempotency-key'];
      if (
        typeof draftId !== 'string' ||
        !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(draftId)
      ) {
        return reply.code(400).send({ message: 'A photo draft ID is required.' });
      }

      const photoBytes = request.body;
      const imageType = Buffer.isBuffer(photoBytes)
        ? await fileTypeFromBuffer(photoBytes).catch(() => undefined)
        : undefined;
      if (!imageType || !supportedImageTypes.has(imageType.mime)) {
        return reply
          .code(415)
          .send({ message: 'Choose a JPEG, PNG, HEIC, HEIF, GIF, WebP, or AVIF image.' });
      }

      const digest = createHash('sha256').update(photoBytes).digest('hex');

      // Reserve one record per draft. Retrying resumes the same object after either service fails.
      const item = await items.findOneAndUpdate(
        { _id: draftId },
        {
          $setOnInsert: {
            ownerId,
            categoryId: category._id,
            contentType: imageType.mime,
            digest,
            imageKey: ownerId + '/' + draftId,
            ready: false,
            createdAt: new Date(),
          },
        },
        { upsert: true, returnDocument: 'after' },
      );

      if (
        !item ||
        item.ownerId !== ownerId ||
        !item.categoryId.equals(category._id) ||
        item.digest !== digest
      ) {
        return reply.code(409).send({ message: 'This draft ID belongs to another upload.' });
      }

      if (item.ready) {
        return { id: draftId };
      }

      await photos.put(item.imageKey, photoBytes, item.contentType);
      await items.updateOne({ _id: draftId, ownerId }, { $set: { ready: true } });

      return reply.code(201).send({ id: draftId });
    },
  );

  app.get<{ Params: { id: string } }>('/items/:id/photo', async (request, reply) => {
    const item = await items.findOne({ _id: request.params.id, ownerId, ready: true });
    if (!item) {
      return reply.code(404).send({ message: 'Photo not found.' });
    }

    const stream = await photos.get(item.imageKey);
    return reply.type(item.contentType).header('Cache-Control', 'private').send(stream);
  });
}
