import { Document } from 'mongoose';

export interface IAgent {
  country: string;
  address: string;
  name: string;
  iddentity: string;
  phone: string;
}

export interface IAgentDocument extends IAgent, Document {}
