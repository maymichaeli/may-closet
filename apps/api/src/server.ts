import Fastify from 'fastify';
import { MongoClient } from 'mongodb';
import { ensureDatabaseIndexes } from './database.ts';
import { openPhotoStorage } from './photo-storage.ts';
import { registerCategories } from './routes/categories.ts';
import { registerItems } from './routes/items.ts';

const host = process.env.HOST;
const port = Number(process.env.PORT);
if (!host) {
  throw new Error('Set HOST in the API environment.');
}
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('Set PORT to a port number between 1 and 65535.');
}

const uri = process.env.MONGODB_URI;
const database = process.env.MONGODB_DB;
if (!uri || !database) {
  throw new Error('Set MONGODB_URI and MONGODB_DB in the API environment.');
}

const app = Fastify({ logger: true, ajv: { customOptions: { coerceTypes: false } } });
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
app.addHook('onClose', () => client.close());

try {
  const db = client.db(database);
  const photos = openPhotoStorage();
  app.addHook('onClose', async () => photos.close());

  await ensureDatabaseIndexes(db);

  const developmentOwnerId = 'may-local';
  app.get('/health', async () => {
    return { status: 'ok' };
  });
  registerCategories(app, db, developmentOwnerId);
  registerItems(app, db, developmentOwnerId, photos);

  await app.listen({ host, port });
} catch (error) {
  await app.close();
  throw error;
}
