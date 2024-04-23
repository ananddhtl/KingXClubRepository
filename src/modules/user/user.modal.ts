import bcrypt from 'bcryptjs';
import { model, Schema } from 'mongoose';
import { NextFunction } from 'express';

import { IUserDocument } from './user.interface';

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
  name: {
    type: String,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  amount: { type: Number, default: 0 },
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
