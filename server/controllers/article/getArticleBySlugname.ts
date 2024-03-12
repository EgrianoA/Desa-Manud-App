import { Request, Response } from "express";
import Article, { IArticleDocument } from "../../models/Article";

const getArticleBySlugname = async (req: Request, res: Response) => {
  try {
    const { slugname } = req.params;
    const spreadedSlugname = slugname.split("-");
    const uniqueKey = spreadedSlugname[spreadedSlugname.length - 1];

    const article = await Article.findOne({ uniqueKey }).populate({
      path: "creator",
    });

    return res.status(200).json({ data: article });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export default getArticleBySlugname;
