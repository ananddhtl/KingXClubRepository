import { IActivityDocument } from './activity.interface';
import { model, Schema } from 'mongoose';

const ActivitySchema: Schema<IActivityDocument> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    index: true,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  balanceChange: {
    type: Number,
    default: 0,
  },
  createdAt: { type: Date, default: Date.now },
});

const ActivityModel = model<IActivityDocument>('activity', ActivitySchema);

export default ActivityModel;
