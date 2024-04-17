import { config } from 'dotenv';
config();

const AppConfig = {
  env: process.env.NODE_ENV,
  versioning: process.env.VERSIONING,
  port: parseInt(process.env.PORT),
  dbConnection: process.env.MONGO_URI,
  log_dir: process.env.LOG_DIR,
  credential: Boolean(parseInt(process.env.CREDENTIALS)),
  log_format: process.env.LOG_FORMAT,
  origin: process.env.ORIGIN,
  secret: process.env.SECRET,
  client_url: process.env.CLIENT_URL,
} as const;

export default AppConfig;
