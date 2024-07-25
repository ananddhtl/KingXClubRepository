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
  referCode: string;
  phone: string;
  amount: number;
  country: string;
  address: string;
  iddentity: string;
  users: ObjectId[];
  createdAt?: Date;
}

export interface IUserDocument extends IUser, Document {}
