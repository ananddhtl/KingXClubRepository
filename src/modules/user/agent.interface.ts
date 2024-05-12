import { Document } from 'mongoose';

export interface IAgent {
  country: string;
  address: string;
  name: string;
  iddentity: Buffer;
  phone: string;
}

export interface IAgentDocument extends IAgent, Document {}
