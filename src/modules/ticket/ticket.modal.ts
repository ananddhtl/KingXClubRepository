import { ITicketDocument } from './ticket.interface';
import { model, Schema } from 'mongoose';

const TicketSchema: Schema<ITicketDocument> = new Schema({
  ticket: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  returns: {
    type: Number,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  position: {
    type: String,
  },
  won: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, required: true },
  time: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const TicketModel = model<ITicketDocument>('ticket', TicketSchema);

export default TicketModel;
