import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';

export const createUser = onRequest((request, response) => {
  if (request.method === 'POST') {
    logger.info('Hello logs!', { structuredData: true });
    const { name } = request.body as { name: string; };
    response.send(`Hello from Firebase ${name}!`);
  }
});
