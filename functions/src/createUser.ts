import { onRequest } from 'firebase-functions/v2/https';
import admin from 'firebase-admin';

type RequestBody = {
  phone: string;
}

export const createUser = onRequest(async (request, response) => {
  if (request.method === 'POST') {
    const { phone } = request.body as RequestBody;

    // Verify the user provided a phone
    if (!phone) {
      response.status(422).send({ error: 'Bad Input' });
      return;
    }

    // Format the phone number to removed dashes and parens
    const formattedPhone = String(phone).replace(/\D/g, '');

    // Create the user account using the phone number
    try {
      const user = await admin.auth().createUser({ uid: formattedPhone });

      // Respond to the user request, saying the account was made
      response.send(user);
    } catch (e) {
      if (e instanceof Error) {
        response.status(500).send({ error: e.message });
      }
    }
  }
});
