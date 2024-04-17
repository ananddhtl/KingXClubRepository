import { config } from 'dotenv';
config();

const EmailConfig = {
  authUser: process.env.AUTH_USER,
  from: process.env.FROM,
  appURL: process.env.APP_URL,
  authPassword: process.env.AUTH_PASSWORD,
} as const;

export default EmailConfig;
