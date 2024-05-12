import { MessagesMapping } from '@/config/messages-mapping';
import { IUser, ROLE } from '@/modules/user/user.interface';
import { HttpException } from '@nestjs/common';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';

export const adminOnly = (): RequestHandler => {
  return (req, res, next) => {
    console.log((req.user as unknown as IUser).role);

    if ((req.user as unknown as IUser).role === ROLE.ADMIN) {
      next();
    } else {
      next(new HttpException(MessagesMapping['#24'], httpStatus.FORBIDDEN));
    }
  };
};
