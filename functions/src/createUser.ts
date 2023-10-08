import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';

export const createUser = onRequest((request, response) => {
  logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase Juan Miguel Paulino Carpio!');
});
