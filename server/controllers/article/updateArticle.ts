import { Request, Response } from "express";
import Article, { IArticle } from "../../models/Article";
import { IRequestWithUserData } from "../../utils/checkHeaders";

const updateArticle = async (req: IRequestWithUserData, res: Response) => {
  try {
    const { body: updatedValue } = req;

    if (!updatedValue.id) {
      return res.status(400).json({ message: "Invalid value" });
    }
    const updatedArticle = await Article.findByIdAndUpdate(
      updatedValue.id,
      updatedValue,
      { new: true }
    );
    return res.status(200).json(updatedArticle);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export default updateArticle;
