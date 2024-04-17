import { config } from 'dotenv';
config();

const AuthConfig = {
  accessToken: {
    secretKey: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY,
    expirationTime: 30,
  },
  refreshToken: {
    secretKey: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY,
    expirationTime: 7,
  },
  forgotPasswordToken: {
    secretKey: process.env.AUTH_JWT_FORGOT_PASSWORD_TOKEN_SECRET_KEY,
    expirationTime: 1,
  },
} as const;

export default AuthConfig;
