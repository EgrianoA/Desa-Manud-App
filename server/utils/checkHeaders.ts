import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const checkHeaders = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: "User unauthorized" });
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "User unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET as string);

    next();
  } catch (error) {
    res.status(401).json({ message: error });
  }
};

export default checkHeaders;
