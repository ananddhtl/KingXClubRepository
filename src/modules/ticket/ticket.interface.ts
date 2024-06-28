import { Document, ObjectId } from 'mongoose';

export interface ITicket {
  place: string;
  position: string;
  time: Date;
  ticket: string;
  digit: number;
  amount: number;
  returns: number;
  won?: boolean;
  user: ObjectId;
  createdAt?: Date;
}

export interface ITicketDocument extends ITicket, Document {}
