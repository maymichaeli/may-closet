import type { Db } from 'mongodb';

export async function ensureDatabaseIndexes(db: Db) {
  await db
    .collection('categories')
    .createIndex({ ownerId: 1, normalizedName: 1 }, { unique: true }, undefined);

  await db.collection('items').createIndex({ ownerId: 1, categoryId: 1, ready: 1, createdAt: -1 });
}
