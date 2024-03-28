import { Response } from "express";
import Report, { IReportDocument } from "../../models/Report";
import { IRequestWithUserData } from "../../utils/checkHeaders";
import { ObjectId } from "mongodb";

const getReportByNumber = async (req: IRequestWithUserData, res: Response) => {
  try {
    const { reportNo } = req.body;

    const report = await Report.findOne({
      $and: [{ reportNo }, { reportedBy: req.userId }],
    }).populate({
      path: "reportedBy",
    });

    return res.status(200).json({ data: report });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export default getReportByNumber;
