import { Document, ObjectId } from 'mongoose';

export interface IAgent {
  country: string;
  referCode: string;
  address: string;
  name: string;
  iddentity: string;
  phone: string;
  users: ObjectId[];
}

export interface IAgentDocument extends IAgent, Document {}
