import mongoose, { Schema, Document } from "mongoose";

export enum UserRole {
  SuperAdmin = "superAdmin",
  Admin = "admin",
  PublicUser = "publicUser",
}

export type IUser = {
  username: string;
  password: string;
  email: string;
  userFullName: string;
  role: UserRole;
};

export type IUserData = Pick<
  IUser,
  "email" | "role" | "userFullName" | "username"
>;

type IUserDocument = Document & IUser;

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userFullName: { type: String, required: true },
    role: {
      type: String,
      default: UserRole.PublicUser,
      enum: Object.values(UserRole),
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUserDocument>("User", UserSchema);
