import Fastify from 'fastify';
import { HOST, PORT } from './constants.ts';

const app = Fastify({ logger: true });

app.get('/health', async () => {
  return { status: 'ok' };
});

await app.listen({ host: HOST, port: PORT });
