import { Document } from 'mongoose';

export interface IResult {
  place: string;
  leftTicketNumber: string;
  rightTicketNumber: string;
  time: Date;
  winnerCountLeft: number;
  totalDistributedAmountLeft: number;
  winnerCountRight: number;
  totalDistributedAmountRight: number;
  winnerCountDouble: number;
  totalDistributedAmountDouble: number;
  winnerCountHalfKing: number;
  totalDistributedAmountHalfKing: number;
  winnerCountFullKing: number;
  totalDistributedAmountFullKing: number;
  totalCollectedAmount: number;
  ticketCount: number;
  createdAt?: Date;
}

export interface IResultDocument extends IResult, Document {}
