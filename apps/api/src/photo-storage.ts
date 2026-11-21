import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export type PhotoStorage = ReturnType<typeof openPhotoStorage>;

export function openPhotoStorage() {
  const {
    R2_ENDPOINT: endpoint,
    R2_BUCKET_NAME: bucket,
    R2_ACCESS_KEY_ID: accessKeyId,
    R2_SECRET_ACCESS_KEY: secretAccessKey,
  } = process.env;
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error('Set the R2 photo storage variables in the API environment.');
  }
  const client = new S3Client({
    endpoint,
    region: 'auto',
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });
  return {
    async put(key: string, bytes: Buffer, contentType: string) {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: bytes,
          ContentType: contentType,
        }),
      );
    },
    async get(key: string) {
      const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      if (!result.Body) {
        throw new Error('Photo storage returned an empty response.');
      }
      return result.Body;
    },
    close: () => client.destroy(),
  };
}
