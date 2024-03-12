import { Request, Response } from "express";
import Article, { IArticleDocument } from "../../models/Article";

const getArticle = async (req: Request, res: Response) => {
  try {
    const { page: pageParam, size: sizeParam, query } = req.query;
    const page = (pageParam as unknown as number) || 1;
    const size = (sizeParam as unknown as number) || 10;
    const filterQuery = {};

    const article = (await Article.find(filterQuery)
      .populate({ path: "creator" })
      .sort([["createdAt", -1]])
      .limit(size)
      .skip((page - 1) * size)) as IArticleDocument[];

    const articleWithSlugname = article.map((article: IArticleDocument) => {
      return {
        ...article.toObject(),
        slugname: encodeURIComponent(
          `${article.title.toLowerCase().replaceAll(" ", "-")}-${
            article.uniqueKey
          }`
        ),
      };
    });

    const count = await Article.countDocuments(filterQuery);
    return res
      .status(200)
      .json({ count: count || 0, data: articleWithSlugname });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export default getArticle;
