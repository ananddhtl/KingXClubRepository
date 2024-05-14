import { Document, ObjectId } from 'mongoose';

export interface IActivity {
  user: ObjectId;
  message: string;
  balanceChange: number;
  createdAt?: Date;
}

export interface IActivityDocument extends IActivity, Document {}
