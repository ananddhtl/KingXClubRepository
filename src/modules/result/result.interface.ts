import { Document } from 'mongoose';

export interface IResult {
  place: string;
  result: number;
  time: Date;
  winnerCount: number;
  totalDistributedAmount: number;
  totalCollectedAmount: number;
  ticketCount: number;
  createdAt?: Date;
}

export interface IResultDocument extends IResult, Document {}
