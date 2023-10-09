import twilio from 'twilio';
// import account from './twilioAccount.json';
// const client = twilio(account.accountSid, account.authToken);

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export default client;
