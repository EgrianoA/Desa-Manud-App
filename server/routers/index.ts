import userRouter from "./user";
import articleRouter from "./article";
import { Router, Request, Response } from "express";

const router: Router = Router();

router.use("/users", userRouter);
router.use("/articles", articleRouter);

export default router;
