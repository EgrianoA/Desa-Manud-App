import { Router } from "express";
import {
  createReport,
  deleteReport,
  getReport,
  updateReport,
} from "../controllers/report";
import checkHeaders from "../utils/checkHeaders";
import { UserRole } from "../models/User";

const reportRouter: Router = Router();

reportRouter.get("/", getReport);
//articleRouter.get("/:slugname", getArticleBySlugname);
reportRouter.post(
  "/",
  (req, res, next) => checkHeaders(req, res, next, UserRole.Admin),
  createReport
);
reportRouter.delete(
  "/",
  (req, res, next) => checkHeaders(req, res, next, UserRole.Admin),
  deleteReport
);
reportRouter.patch(
  "/",
  (req, res, next) => checkHeaders(req, res, next, UserRole.Admin),
  updateReport
);

export default reportRouter;
