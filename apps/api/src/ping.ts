import { MongoClient } from 'mongodb';

async function pingDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI');

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    await client.db().command({ ping: 1 });
    console.log('Atlas ping succeeded.');
  } finally {
    await client.close();
  }
}

try {
  await pingDatabase();
} catch (error) {
  const reason = !process.env.MONGODB_URI ? 'missing MONGODB_URI'
    : error instanceof Error ? error.name : 'unknown error';
  console.error('Atlas ping failed:', reason);
  process.exitCode = 1;
}
