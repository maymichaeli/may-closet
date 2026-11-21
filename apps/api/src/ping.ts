import { MongoClient } from 'mongodb';

async function pingDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI');
  }

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
  let reason = 'unknown error';
  if (!process.env.MONGODB_URI) {
    reason = 'missing MONGODB_URI';
  } else if (error instanceof Error) {
    reason = error.name;
  }

  console.error('Atlas ping failed:', reason);
  process.exitCode = 1;
}
