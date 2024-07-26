import { MessagesMapping } from '@/config/messages-mapping';
import { IUser, ROLE } from '@/modules/user/user.interface';
import { HttpException } from '@nestjs/common';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';

export const masterOnly = (): RequestHandler => {
  return (req, res, next) => {
    if ((req.user as unknown as IUser).role === ROLE.MASTER) {
      next();
    } else {
      next(new HttpException(MessagesMapping['#24'], httpStatus.FORBIDDEN));
    }
  };
};

export const adminOnly = (hasMasterControl = false): RequestHandler => {
  return (req, res, next) => {
    console.log((req.user as unknown as IUser).role);

    if ((req.user as unknown as IUser).role === ROLE.MASTER && hasMasterControl) next();
    else if ((req.user as unknown as IUser).role === ROLE.ADMIN) next();
    else next(new HttpException(MessagesMapping['#24'], httpStatus.FORBIDDEN));
  };
};

export const AgentOrAgentOnly = (hasMasterControl = false): RequestHandler => {
  return (req, res, next) => {
    if ((req.user as unknown as IUser).role === ROLE.MASTER && hasMasterControl) next();
    else if ((req.user as unknown as IUser).role === ROLE.AGENT || (req.user as unknown as IUser).role === ROLE.ADMIN) next();
    else next(new HttpException(MessagesMapping['#24'], httpStatus.FORBIDDEN));
  };
};

export const userOnly = (hasMasterControl = false): RequestHandler => {
  return (req, res, next) => {
    if ((req.user as unknown as IUser).role === ROLE.MASTER && hasMasterControl) next();
    else if ((req.user as unknown as IUser).role === ROLE.USER) next();
    else next(new HttpException(MessagesMapping['#24'], httpStatus.FORBIDDEN));
  };
};
