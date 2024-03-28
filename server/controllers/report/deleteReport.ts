import { Request, Response } from "express";
import Report, { IReport } from "../../models/Report";
import { IRequestWithUserData } from "../../utils/checkHeaders";

const deleteReport = async (req: IRequestWithUserData, res: Response) => {
  try {
    const { body: deletedValue } = req;
    if (!deletedValue.id) {
      return res.status(400).json({ message: "Invalid value" });
    }
    await Report.findByIdAndDelete(deletedValue.id);
    return res.status(200).json(true);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export default deleteReport;
