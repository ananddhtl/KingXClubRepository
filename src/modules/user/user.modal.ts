import bcrypt from 'bcryptjs';
import { Document, model, Schema } from 'mongoose';
import { NextFunction } from 'express';

import { IAddress, IUserDocument, ROLE } from './user.interface';

const addressSchema: Schema<IAddress & Document> = new Schema({
  street: {
    type: String,
  },
  city: {
    type: String,
  },
  zip: {
    type: Number,
  },
});

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
  address: addressSchema,
  role: { type: String, enum: Object.values(ROLE), default: ROLE.CONSUMER },
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
