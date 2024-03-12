import { Request, Response } from "express";
import Article, { IArticle } from "../../models/Article";
import { IRequestWithUserData } from "../../utils/checkHeaders";

const deleteArticle = async (req: IRequestWithUserData, res: Response) => {
  try {
    const { body: deletedValue } = req;
    if (!deletedValue.id) {
      return res.status(400).json({ message: "Invalid value" });
    }
    await Article.findByIdAndDelete(deletedValue.id);
    return res.status(200).json(true);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export default deleteArticle;
