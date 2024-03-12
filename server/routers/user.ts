import { Router } from "express";
import { register, login, getUsers } from "../controllers/user";
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

export default userRouter;
