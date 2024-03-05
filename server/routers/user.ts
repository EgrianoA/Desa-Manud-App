import { Router } from "express";
import { register, login, getUsers } from "../controllers/user";
import checkHeaders from "../utils/checkHeaders";

const userRouter: Router = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/", checkHeaders, getUsers); // This should be protected in a real application

export default userRouter;
