import type { FastifyInstance } from 'fastify';
import { MongoServerError, type Db } from 'mongodb';

interface Category {
  ownerId: string;
  name: string;
  normalizedName: string;
}

// Local single-user identity until requests carry an authenticated user.
const developmentOwnerId = 'may-local';

export async function registerCategories(app: FastifyInstance, db: Db) {
  const categories = db.collection<Category>('categories');
  await categories.createIndex({ ownerId: 1, normalizedName: 1 }, { unique: true }, undefined);

  app.get('/categories', async () => {
    const records = await categories
      .find({ ownerId: developmentOwnerId }, { projection: { _id: 1, name: 1 } })
      .sort({ normalizedName: 1 })
      .toArray();

    return records.map(record => ({ id: record._id.toHexString(), name: record.name }));
  });

  app.post<{ Body: { name: string } }>('/categories', {
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        properties: { name: { type: 'string', pattern: '\\S' } },
      },
    },
  }, async (request, reply) => {
    const name = request.body.name.trim();
    try {
      const result = await categories.insertOne({
        ownerId: developmentOwnerId,
        name,
        normalizedName: name.toLowerCase(),
      });
      return reply.code(201).send({ id: result.insertedId.toHexString(), name });
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        return reply.code(409).send({ message: 'A category with this name already exists.' });
      }
      throw error;
    }
  });
}
