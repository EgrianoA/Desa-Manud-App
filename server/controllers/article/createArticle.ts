import { Request, Response } from "express";
import Article, { IArticle } from "../../models/Article";
import { ObjectId } from "mongodb";
import { IRequestWithUserData } from "../../utils/checkHeaders";
import generateRandomString from "../../utils/randomString";

const createArticle = async (req: IRequestWithUserData, res: Response) => {
  try {
    const { body } = req;

    const newArticle = await Article.create({
      ...body,
      uniqueKey: generateRandomString(7),
      creator: new ObjectId(req.userId),
    });
    return res.status(200).json(newArticle);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export default createArticle;
