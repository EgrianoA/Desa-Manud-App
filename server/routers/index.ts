import userRouter from "./user";
import articleRouter from "./article";
import reportRouter from "./report";
import { Router, Request, Response } from "express";

const router: Router = Router();

router.use("/users", userRouter);
router.use("/articles", articleRouter);
router.use("/reports", reportRouter);

export default router;
