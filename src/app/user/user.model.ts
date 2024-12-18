import bcrypt from 'bcrypt';
import { model, Model, Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import config from "../config";

const userSchema = new Schema({
  id: {
    type: String,
    required: true,

  },
  password: {
    type: String,
    required: true,
    select: 0,
  },
  needspasswordChange: {
    type: Boolean,
    default: true,
  },
  passwordChangedAt: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['admin', 'student', 'faculty'],
    required: true,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['in-progress', 'block'],
    default: 'in-progress',
  }


},
  {
    timestamps: true,

  }
)

userSchema.pre('save', async function (next) {

  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

//set empty string after save pass
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password');
};
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema)