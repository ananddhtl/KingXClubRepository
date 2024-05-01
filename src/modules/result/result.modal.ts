import { IResultDocument } from './result.interface';
import { model, Schema } from 'mongoose';

const ResultSchema: Schema<IResultDocument> = new Schema({
  place: {
    type: String,
    required: true,
  },
  leftTicketNumber: {
    type: Number,
    required: true,
  },
  rightTicketNumber: {
    type: Number,
  },
  time: {
    type: Date,
    required: true,
  },
  winnerCountLeft: {
    type: Number,
    required: true,
  },
  totalDistributedAmountLeft: {
    type: Number,
    required: true,
  },
  winnerCountRight: {
    type: Number,
    required: true,
  },
  totalDistributedAmountRight: {
    type: Number,
    required: true,
  },
  winnerCountDouble: {
    type: Number,
    required: true,
  },
  totalDistributedAmountDouble: {
    type: Number,
    required: true,
  },
  totalCollectedAmount: {
    type: Number,
    required: true,
  },
  ticketCount: {
    type: Number,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const ResultModel = model<IResultDocument>('result', ResultSchema);

export default ResultModel;
