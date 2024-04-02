import { Response } from "express";
import Article, { IArticle } from "../../models/Article";
import { IRequestWithUserData } from "../../utils/checkHeaders";
import {
  BucketType,
  deleteUploadedFiles,
  uploadFile,
} from "../../utils/storage";

const uploadArticleImage = async (req: IRequestWithUserData, res: Response) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: "file invalid" });
    }

    const { articleId } = req.params;

    if (!articleId) {
      return res.status(400).json({ message: "article invalid" });
    }

    const files = req.files as { headerImages: Express.Multer.File[] };

    if (!files) {
      return res.status(400).json({ message: "file array is empty" });
    }

    const headerImages = files.headerImages;

    const uploadFilesResults = await Promise.all(
      headerImages.map(async (file: Express.Multer.File) => {
        const uploadedFileRes = await uploadFile(
          BucketType.Public,
          "/articles",
          file.originalname,
          file.buffer
        );
        return uploadedFileRes;
      })
    );

    if (uploadFilesResults.length === 0) {
      return res.status(400).json({ message: "file upload failed" });
    }

    const articleData = (await Article.findById(articleId)) as IArticle;

    if (!articleData) {
      return res.status(400).json({ message: "article invalid" });
    }

    if (articleData.headerImage.length) {
      deleteUploadedFiles(articleData.headerImage);
    }

    const newArticleImage = uploadFilesResults.map((uploadedFile) => ({
      ...uploadedFile,
      alt: "",
      description: "",
    }));

    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      { headerImage: newArticleImage },
      { new: true }
    );

    return res.status(200).json(updatedArticle);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

export default uploadArticleImage;
