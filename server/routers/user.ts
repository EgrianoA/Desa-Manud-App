import { Router } from "express";
import { register, login, getUsers, updateUser } from "../controllers/user";
import checkHeaders from "../utils/checkHeaders";
import { UserRole } from "../models/User";

const userRouter: Router = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get(
  "/",
  (req, res, next) => checkHeaders(req, res, next, UserRole.Admin),
  getUsers
);
userRouter.patch(
  "/",
  (req, res, next) => checkHeaders(req, res, next, UserRole.Admin),
  updateUser
);

export default userRouter;
