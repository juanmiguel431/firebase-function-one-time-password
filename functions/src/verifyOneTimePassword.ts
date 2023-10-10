import { onRequest } from 'firebase-functions/v2/https';
import admin from 'firebase-admin';
import { UserCodeValidation } from './models/user';

type Request = {
  phone: string;
  code: string;
}

export const verifyOneTimePassword = onRequest(async (request, response) => {
  if (request.method !== 'POST') {
    response.status(404);
    return;
  }
  if (request.method === 'POST') {
    const { phone, code } = request.body as Request;

    if (!phone || !code) {
      response.status(422).send({ error: 'Phone a code must be provided.' });
      return;
    }

    try {
      const formattedPhone = String(phone).replace(/\D/g, '');
      const formattedCode = parseInt(code);

      const auth = admin.auth();

      await auth.getUser(formattedPhone);

      const ref = admin.database().ref(`users/${formattedPhone}`);

      const snapshot = await ref.get();
      const userCodeValidation = snapshot.val() as UserCodeValidation;

      if (!userCodeValidation.valid || userCodeValidation.code !== formattedCode) {
        response.status(422).send({ error: 'Code not valid.' });
        return;
      }

      await ref.update({ valid: false });

      const token = await auth.createCustomToken(formattedPhone);

      response.send({ token: token });
    } catch (e) {
      if (e instanceof Error) {
        response.status(500).send({ error: e.message });
      }
    }
  }
});

