import { useState } from "react";
import useApiHooks, { errorResponse } from "../utilities/useApiHooks";

export enum UserRole {
  SuperAdmin = "superAdmin",
  Admin = "admin",
  PublicUser = "publicUser",
}

export const userRoleNaming = {
  superAdmin: "Super Admin",
  admin: "Admin",
  publicUser: "Public User",
};

export type IUser = {
  _id: string;
  username: string;
  password: string;
  email: string;
  userFullName: string;
  role: UserRole;
};

type FetchUserParams = {
  page?: number;
  pageSize?: number;
  query?: string;
};

export const useFetchUsers = ({
  page = 1,
  pageSize = 10,
  query,
}: FetchUserParams) => {
  const [response, setResponse] = useState({ errorResponse });
  const params = `page=${page}&size=${pageSize}${
    query ? `&query=${JSON.stringify(query)}` : ""
  }`;
  try {
    const response = useApiHooks({
      method: "get",
      url: `${process.env.BE_BASEURL}/api/users?${params}`,
    });
    return response;
  } catch {
    return response.errorResponse;
  }
};

export const useCreateUser = () => {};

export const useUpdateUser = () => {};

export const useDeleteUser = () => {};
