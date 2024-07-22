import { model, Schema } from 'mongoose';
import { IAgentDocument } from './agent.interface';

const AgentSchema: Schema<IAgentDocument> = new Schema({
  name: {
    type: String,
    required: true,
  },
  referCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  iddentity: {
    type: String,
    require: true,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
});

const AgentModel = model('agent', AgentSchema);

export default AgentModel;
