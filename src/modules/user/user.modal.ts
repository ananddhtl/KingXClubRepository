import bcrypt from 'bcryptjs';
import { model, Schema } from 'mongoose';
import { NextFunction } from 'express';

import { IUserDocument, ROLE } from './user.interface';

const UserSchema: Schema<IUserDocument> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(ROLE),
    default: ROLE.USER,
  },
  referCode: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  country: {
    type: String,
  },
  address: {
    type: String,
  },
  iddentity: {
    type: String,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  amount: { type: Number, default: 50, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre<IUserDocument>('save', function (next: NextFunction) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      this.password = hash;
      return next();
    });
  });
});

const UserModel = model('user', UserSchema);

export default UserModel;
