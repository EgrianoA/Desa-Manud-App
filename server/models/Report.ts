import { ObjectId } from "mongodb";
import mongoose, { Schema, Document } from "mongoose";
import { UploadedFile } from "../utils/storage";

enum ReportType {
  Kebersihan = "kebersihan",
  Keamanan = "keamanan",
  LainLain = "lainLain",
}

enum StatusType {
  New = "new",
  OnCheck = "onCheck",
  Cancelled = "cancelled",
  Rejected = "rejected",
  Done = "done",
}

export type IReport = {
  type: ReportType;
  reportNo: string;
  description: string;
  attachment: UploadedFile[];
  notes: string;
  status: StatusType;
  reportedBy: ObjectId;
};

export type IReportDocument = Document & IReport;

const ReportSchema: Schema = new Schema(
  {
    type: {
      type: String,
      default: ReportType.LainLain,
      enum: Object.values(ReportType),
      required: true,
    },
    reportNo: { type: String, required: true },
    description: { type: String, required: true },
    notes: { type: String, required: false, default: "" },
    attachment: { type: Array, default: [] },
    status: {
      type: String,
      default: StatusType.New,
      enum: Object.values(StatusType),
      required: true,
    },
    reportedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<IReportDocument>("Report", ReportSchema);
