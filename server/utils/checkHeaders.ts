import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { UserRole } from "../models/User";

export interface IRequestWithUserData extends Request {
  userId?: string;
}

const userHasAccess = (userRole: UserRole, accessRole?: UserRole): boolean => {
  if (!accessRole) {
    return true;
  }

  switch (accessRole) {
    case UserRole.SuperAdmin: {
      if (userRole === UserRole.SuperAdmin) {
        return true;
      }
      break;
    }

    case UserRole.Admin: {
      if (userRole === UserRole.SuperAdmin || userRole === UserRole.Admin) {
        return true;
      }
      break;
    }

    default:
      return true;
  }

  return false;
};

const checkHeaders = (
  req: IRequestWithUserData,
  res: Response,
  next: NextFunction,
  requiredAccess?: UserRole
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: "User unauthorized" });
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "User unauthorized" });
    }

    const jwtValue = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!userHasAccess(jwtValue.userData.role, requiredAccess)) {
      return res.status(401).json({ message: "User unauthorized" });
    }

    req.userId = jwtValue.userData._id;

    return next();
  } catch (error) {
    return res.status(401).json({ message: error });
  }
};

export default checkHeaders;
