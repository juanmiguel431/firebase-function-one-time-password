import { onRequest } from 'firebase-functions/v2/https';
import admin from 'firebase-admin';
import client from './twilio';

type Request = {
  phone: string;
}

export const requestOneTimePassword = onRequest(async (request, response) => {
  if (request.method === 'post') {
    const { phone } = request.body as Request;

    if (!phone) {
      response.status(422).send({ error: 'You must provide a phone number.' });
      return;
    }

    // Format the phone number to removed dashes and parens
    const formattedPhone = String(phone).replace(/\D/g, '');

    try {
      const userRecord = await admin.auth().getUser(formattedPhone);

      if (!userRecord) {
        response.status(422).send({ error: 'User not found.' });
        return;
      }

      const message = await client.messages.create({
        body: 'Hola, Soy Juan Miguel',
        from: '+18622924301',
        to: '+18298205436',
      });

      console.log(message.sid);
    } catch (e) {
      if (e instanceof Error) {
        response.status(500).send({ error: e.message });
      }
    }
  }
});
