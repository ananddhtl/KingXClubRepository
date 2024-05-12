import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@nestjs/common';
import httpStatus from 'http-status';
import { MessagesMapping } from '@/config/messages-mapping';
import AuthConfig from '@/config/auth.config';
import { IUser } from '@/modules/user/user.interface';
const authMiddleware = async (
  req: Request & {
    headers: { authorization: string; 'x-wallet-address': string };
  },
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.jwt || req.headers.authorization.split(' ')[1];

  if (token) {
    try {
      const decoded = verify(token, AuthConfig.accessToken.secretKey);
      req.user = decoded.sub as unknown as IUser;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      next(new HttpException('Not authorized, token failed', httpStatus.UNAUTHORIZED));
    }
  } else {
    next(new HttpException(MessagesMapping['#1'], httpStatus.BAD_REQUEST));
  }
};

export default authMiddleware;
