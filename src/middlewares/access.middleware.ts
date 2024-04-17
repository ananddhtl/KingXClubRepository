import { MessagesMapping } from '@/config/messages-mapping';
import { IUser, IUserDocument, ROLE } from '@/modules/user/user.interface';
import { HttpException } from '@nestjs/common';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';

export const adminOnly = (): RequestHandler => {
  return (req, res, next) => {
    if ((req.user as unknown as IUser).role === ROLE.ADMIN) {
      next();
    } else {
      next(new HttpException(MessagesMapping['#24'], httpStatus.FORBIDDEN));
    }
  };
};

export const currentOnly = (): RequestHandler => {
  return (req, res, next) => {
    if ((req.user as unknown as IUser).role === ROLE.ADMIN) next();
    else if ((req.user as unknown as IUser).role === ROLE.PRODUCER || (req.user as unknown as IUser).role === ROLE.CONSUMER) {
      const { userId = '' } = {
        ...req.body,
        ...req.params,
        ...req.query,
      };
      if (String((req.user as unknown as IUserDocument)._id) === userId) next();
      else next(new HttpException(MessagesMapping['#24'], httpStatus.FORBIDDEN));
    } else {
      next(new HttpException(MessagesMapping['#24'], httpStatus.FORBIDDEN));
    }
  };
};
