import { Request, Response } from "express";
import Report, { IReportDocument } from "../../models/Report";

const getReport = async (req: Request, res: Response) => {
  try {
    const { page: pageParam, size: sizeParam, ...query } = req.query;
    const page = (pageParam as unknown as number) || 1;
    const size = (sizeParam as unknown as number) || 10;
    const filterQuery = {};

    const report = (await Report.find(filterQuery)
      .populate({ path: "reportedBy" })
      .sort([["createdAt", -1]])
      .limit(size)
      .skip((page - 1) * size)) as IReportDocument[];

    const count = await Report.countDocuments(filterQuery);
    return res.status(200).json({ count: count || 0, data: report });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export default getReport;
