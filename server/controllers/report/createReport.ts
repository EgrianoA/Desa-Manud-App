import { Request, Response } from "express";
import Report, { IReport } from "../../models/Report";
import { ObjectId } from "mongodb";
import { IRequestWithUserData } from "../../utils/checkHeaders";
import dayjs from "dayjs";

const createReport = async (req: IRequestWithUserData, res: Response) => {
  try {
    const { body } = req;

    const documentCount =
      (await Report.countDocuments({
        createdAt: {
          $gte: dayjs().startOf("d"),
          $lt: dayjs(),
        },
      })) + 1;

    const incrementNo = `${new Array(
      4 - (documentCount.toString().length - 1)
    ).join("0")}${documentCount.toString()}`;

    const newReport = await Report.create({
      ...body,
      reportNo: `LAPORAN-${dayjs().format("DDMMYYYY")}-${incrementNo}`,
      reportedBy: new ObjectId(req.userId),
    });

    return res.status(200).json(newReport);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export default createReport;
