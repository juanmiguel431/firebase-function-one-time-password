import { onRequest } from 'firebase-functions/v2/https';
import admin from 'firebase-admin';
import client from './twilio';

type Request = {
  phone: string;
}

export const requestOneTimePassword = onRequest(async (request, response) => {
  if (request.method !== 'POST') {
    response.status(404);
    return;
  }
  if (request.method === 'POST') {
    const { phone } = request.body as Request;

    if (!phone) {
      response.status(422).send({ error: 'You must provide a phone number.' });
      return;
    }

    try {
      // Format the phone number to removed dashes and parens
      const formattedPhone = String(phone).replace(/\D/g, '');

      const userRecord = await admin.auth().getUser(formattedPhone);
      if (!userRecord) {
        response.status(422).send({ error: 'User not found.' });
        return;
      }

      const code = Math.floor(Math.random() * 8999 + 1000);

      const message = await client.messages.create({
        body: `Your code is ${code}`,
        from: '+18622924301',
        to: formattedPhone,
      });

      await admin.database()
        .ref(`users/${phone}`)
        .update({ code: code, valid: true, messageSid: message.sid });

      response.send({ success: true });
    } catch (e) {
      if (e instanceof Error) {
        response.status(500).send({ error: e.message });
      }
    }
  }
});
