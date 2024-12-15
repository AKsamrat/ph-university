import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
  id: string;
  password: string;
  needspasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'admin' | 'student' | 'faculty'
  isDeleted: boolean;
  status: 'in-progress' | 'blocked';
}

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExistsByCustomId(id: string): Promise<TUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;

export type NewUser = {
  password: string;
  role: string
  id: string;
}