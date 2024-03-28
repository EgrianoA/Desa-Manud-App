import { Request, Response } from "express";
import Article, { IArticleDocument } from "../../models/Article";

const filterQuery = (query: string) => {
  const parsedQuery: any = JSON.parse(query);
  const filterQuery: any = {};

  if (parsedQuery.types) {
    filterQuery.type = { $in: parsedQuery.types };
  }

  return filterQuery;
};

const getArticle = async (req: Request, res: Response) => {
  try {
    const { page: pageParam, size: sizeParam, query } = req.query;
    const page = (pageParam as unknown as number) || 1;
    const size = (sizeParam as unknown as number) || 10;
    const filter = query ? filterQuery(query as string) : {};

    const article = (await Article.find(filter)
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

    const count = await Article.countDocuments(filter);
    return res
      .status(200)
      .json({ count: count || 0, data: articleWithSlugname });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export default getArticle;
