import { Router } from "express";
import {
  createArticle,
  deleteArticle,
  getArticle,
  updateArticle,
  uploadArticleImage,
  getArticleBySlugname,
} from "../controllers/article";
import checkHeaders from "../utils/checkHeaders";
import { UserRole } from "../models/User";
import multer from "multer";

const upload = multer({
  dest: "uploads/",
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const articleRouter: Router = Router();

articleRouter.get("/", getArticle);
articleRouter.get("/:slugname", getArticleBySlugname);
articleRouter.post(
  "/",
  (req, res, next) => checkHeaders(req, res, next, UserRole.Admin),
  createArticle
);
articleRouter.post(
  "/uploadHeaderImage/:articleId",
  upload.fields([{ name: "headerImages", maxCount: 5 }]),
  (req, res, next) => checkHeaders(req, res, next, UserRole.Admin),
  uploadArticleImage
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
