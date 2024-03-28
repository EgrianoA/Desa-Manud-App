import { Router } from "express";
import {
  createReport,
  deleteReport,
  getReport,
  getReportByNumber,
  updateReport,
  uploadReportAttachment,
} from "../controllers/report";
import checkHeaders from "../utils/checkHeaders";
import { UserRole } from "../models/User";
import multer from "multer";

const upload = multer({
  dest: "uploads/",
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const reportRouter: Router = Router();

reportRouter.get(
  "/",
  (req, res, next) => checkHeaders(req, res, next),
  getReport
);

reportRouter.post(
  "/byNumber",
  (req, res, next) => checkHeaders(req, res, next),
  getReportByNumber
);

reportRouter.post(
  "/",
  (req, res, next) => checkHeaders(req, res, next),
  createReport
);

reportRouter.post(
  "/uploadReportAttachment/:reportId",
  upload.fields([{ name: "reportAttachment", maxCount: 5 }]),
  (req, res, next) => checkHeaders(req, res, next),
  uploadReportAttachment
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
