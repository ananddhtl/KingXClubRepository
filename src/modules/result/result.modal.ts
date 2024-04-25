import { IResultDocument } from './result.interface';
import { model, Schema } from 'mongoose';

const ResultSchema: Schema<IResultDocument> = new Schema({
  place: {
    type: String,
    required: true,
  },
  result: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  winnerCount: {
    type: Number,
    required: true,
  },
  totalDistributedAmount: {
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
