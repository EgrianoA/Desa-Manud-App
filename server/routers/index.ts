import userRouter from "./user";
import { Router, Request, Response } from "express";

const router: Router = Router();

router.use("/users", userRouter);

export default router;
