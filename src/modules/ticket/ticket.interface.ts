import { Document, ObjectId } from 'mongoose';

export interface ITicket {
  place: string;
  time: Date;
  ticket: number;
  digit: number;
  amount: number;
  returns: number;
  won?: boolean;
  user: ObjectId;
  createdAt?: Date;
}

export interface ITicketDocument extends ITicket, Document {}
