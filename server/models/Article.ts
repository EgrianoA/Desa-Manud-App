import { ObjectId } from "mongodb";
import mongoose, { Schema, Document } from "mongoose";

type HeaderImage = {
  url: string;
  description: string;
  alt: string;
};

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
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    headerImage: { type: Array, default: [] },
    uniqueKey: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IArticleDocument>("Article", ArticleSchema);
