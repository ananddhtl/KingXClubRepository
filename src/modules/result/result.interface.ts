import { Document } from 'mongoose';

export interface IResult {
  place: string;
  leftTicketNumber: number;
  rightTicketNumber: number;
  time: Date;
  winnerCountLeft: number;
  totalDistributedAmountLeft: number;
  winnerCountRight: number;
  totalDistributedAmountRight: number;
  winnerCountDouble: number;
  totalDistributedAmountDouble: number;
  totalCollectedAmount: number;
  ticketCount: number;
  createdAt?: Date;
}

export interface IResultDocument extends IResult, Document {}
