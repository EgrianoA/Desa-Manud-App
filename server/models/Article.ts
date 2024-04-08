import { ObjectId } from "mongodb";
import mongoose, { Schema, Document } from "mongoose";
import { UploadedFile } from "../utils/storage";

type HeaderImage = UploadedFile & {
  description: string;
  alt: string;
};

enum ArticleKind {
  Umum = "umum",
  Kebersihan = "kebersihan",
  Kesehatan = "kesehatan",
  ProgramKerja = "programKerja",
  Kemitraan = "kemitraan",
}

export type IArticle = {
  title: string;
  content: string;
  creator: ObjectId;
  headerImage: HeaderImage[];
  uniqueKey: string;
};
export type IArticleDocument = Document & IArticle;

const ArticleSchema: Schema = new Schema(
  {
    type: {
      type: String,
      default: ArticleKind.Umum,
      enum: Object.values(ArticleKind),
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    headerImage: { type: Array, default: [] },
    uniqueKey: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IArticleDocument>("Article", ArticleSchema);
