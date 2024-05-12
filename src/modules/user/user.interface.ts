import { Document } from 'mongoose';

export enum ROLE {
  ADMIN = 'admin',
  AGENT = 'agent',
  USER = 'user',
}
export interface IUser {
  email: string;
  referCode: string;
  role: ROLE;
  name: string;
  password: string;
  phone: string;
  amount: number;
}

export interface IUserDocument extends IUser, Document {}
