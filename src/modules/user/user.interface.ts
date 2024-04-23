import { Document } from 'mongoose';

export interface IUser {
  email: string;
  name: string;
  password: string;
  phone: string;
  amount: number;
}

export interface IUserDocument extends IUser, Document {}
