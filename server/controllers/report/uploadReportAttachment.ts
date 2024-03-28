import { Response } from "express";
import Report, { IReport } from "../../models/Report";
import { IRequestWithUserData } from "../../utils/checkHeaders";
import {
  BucketType,
  deleteUploadedFiles,
  uploadFile,
} from "../../utils/storage";

const uploadReportAttachment = async (
  req: IRequestWithUserData,
  res: Response
) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: "file invalid" });
    }

    const { reportId } = req.params;

    if (!reportId) {
      return res.status(400).json({ message: "report invalid" });
    }

    const files = req.files as { reportAttachment: Express.Multer.File[] };

    if (!files) {
      return res.status(400).json({ message: "file array is empty" });
    }

    const reportAttachment = files.reportAttachment;

    const uploadFilesResults = await Promise.all(
      reportAttachment.map(async (file: Express.Multer.File) => {
        const uploadedFileRes = await uploadFile(
          BucketType.Public,
          "/reports",
          file.originalname,
          file.buffer
        );
        return uploadedFileRes;
      })
    );

    if (uploadFilesResults.length === 0) {
      return res.status(400).json({ message: "file upload failed" });
    }

    const reportData = (await Report.findById(reportId)) as IReport;

    if (!reportData) {
      return res.status(400).json({ message: "report invalid" });
    }

    if (reportData.attachment.length) {
      deleteUploadedFiles(reportData.attachment);
    }

    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      { attachment: uploadFilesResults },
      { new: true }
    );

    return res.status(200).json(updatedReport);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

export default uploadReportAttachment;
