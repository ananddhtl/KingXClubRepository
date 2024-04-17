import { Schema, model } from 'mongoose';
import { ITokenDocument, TokenTypes } from './token.interface';

const TokenSchema: Schema<ITokenDocument> = new Schema({
  token: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
    required: true,
  },
  expires: { type: Date, required: true },
  type: { type: String, required: true, enum: Object.values(TokenTypes) },
});

const TokenModal = model('token', TokenSchema);

export default TokenModal;
