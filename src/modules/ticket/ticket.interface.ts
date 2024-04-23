import { Document, ObjectId } from 'mongoose';

export interface ITicket {
  place: string;
  result?: number;
  time: Date;
  ticket: number;
  amount: number;
  returns: number;
  won?: boolean;
  user: ObjectId;
  createdAt?: Date;
}

export interface ITicketDocument extends ITicket, Document {}
