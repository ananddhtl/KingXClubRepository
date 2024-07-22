import { IResultDocument } from './result.interface';
import { model, Schema } from 'mongoose';

const ResultSchema: Schema<IResultDocument> = new Schema({
  place: {
    type: String,
    required: true,
  },
  leftTicketNumber: {
    type: String,
  },
  rightTicketNumber: {
    type: String,
  },
  time: {
    type: Date,
    required: true,
  },
  winnerCountLeft: {
    type: Number,
  },
  totalDistributedAmountLeft: {
    type: Number,
  },
  winnerCountRight: {
    type: Number,
  },
  totalDistributedAmountRight: {
    type: Number,
  },
  winnerCountDouble: {
    type: Number,
  },
  totalDistributedAmountDouble: {
    type: Number,
  },
  totalCollectedAmount: {
    type: Number,
  },
  ticketCount: {
    type: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

const ResultModel = model<IResultDocument>('result', ResultSchema);

export default ResultModel;
