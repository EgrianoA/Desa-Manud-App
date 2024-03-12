import { Router } from "express";
import {
  createArticle,
  deleteArticle,
  getArticle,
  updateArticle,
  getArticleBySlugname,
} from "../controllers/article";
import checkHeaders from "../utils/checkHeaders";
import { UserRole } from "../models/User";

const articleRouter: Router = Router();

articleRouter.get("/", getArticle);
articleRouter.get("/:slugname", getArticleBySlugname);
articleRouter.post(
  "/",
  (req, res, next) => checkHeaders(req, res, next, UserRole.Admin),
  createArticle
);
articleRouter.delete(
  "/",
  (req, res, next) => checkHeaders(req, res, next, UserRole.Admin),
  deleteArticle
);
articleRouter.patch(
  "/",
  (req, res, next) => checkHeaders(req, res, next, UserRole.Admin),
  updateArticle
);

export default articleRouter;
