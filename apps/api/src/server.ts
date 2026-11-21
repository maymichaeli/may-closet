import Fastify from 'fastify';
import { MongoClient } from 'mongodb';
import { registerCategories } from './categories.ts';

const host = process.env.HOST;
const port = Number(process.env.PORT);
if (!host) throw new Error('Set HOST in the API environment.');
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('Set PORT to a port number between 1 and 65535.');
}

const uri = process.env.MONGODB_URI;
const database = process.env.MONGODB_DB;
if (!uri || !database) throw new Error('Set MONGODB_URI and MONGODB_DB in the API environment.');

const app = Fastify({ logger: true, ajv: { customOptions: { coerceTypes: false } } });
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
app.addHook('onClose', () => client.close());

app.get('/health', async () => {
  return { status: 'ok' };
});

try {
  await registerCategories(app, client.db(database));
  await app.listen({ host, port });
} catch (error) {
  await client.close();
  throw error;
}
