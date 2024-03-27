import mongoose, { Schema, Document } from "mongoose";

export enum UserRole {
  SuperAdmin = "superAdmin",
  Admin = "admin",
  PublicUser = "publicUser",
}

export type IGenericUser = {
  username: string;
  password: string;
  email: string;
  userFullName: string;
};

export type IAdminUser = IGenericUser & {
  role: UserRole.Admin;
};

export type ISuperAdminUser = IGenericUser & {
  role: UserRole.SuperAdmin;
};

export type IPublicUser = IGenericUser & {
  role: UserRole.PublicUser;
  nik: string;
};

export type IUserData = Pick<
  IUser,
  "email" | "role" | "userFullName" | "username"
>;

export type IUser = IAdminUser | ISuperAdminUser | IPublicUser;

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
    nik: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUserDocument>("User", UserSchema);
