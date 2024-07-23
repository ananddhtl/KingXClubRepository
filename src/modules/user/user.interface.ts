import { Document, ObjectId } from 'mongoose';

export enum ROLE {
  MASTER = 'master',
  ADMIN = 'admin',
  AGENT = 'agent',
  USER = 'user',
}

export interface IUser {
  email: string;
  role: ROLE;
  name: string;
  password: string;
  agent: ObjectId;
  phone: string;
  amount: number;
}

export interface IUserDocument extends IUser, Document {}
