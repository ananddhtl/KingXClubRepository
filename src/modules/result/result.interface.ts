import { Document } from 'mongoose';

export interface IResult {
  place: string;
  result?: number;
  time: Date;
  totalAmount: number;
  totalReturns: number;
  totalTicket: number;
  createdAt?: Date;
}

export interface IResultDocument extends IResult, Document {}
