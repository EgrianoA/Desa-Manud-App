import { Request, Response } from "express";
import Report, { IReport } from "../../models/Report";
import { IRequestWithUserData } from "../../utils/checkHeaders";

const updateReport = async (req: IRequestWithUserData, res: Response) => {
  try {
    const { body: updatedValue } = req;
    console.log(updatedValue)
    if (!updatedValue.id) {
      return res.status(400).json({ message: "Invalid value" });
    }
    const updatedReport = await Report.findByIdAndUpdate(
      updatedValue.id,
      updatedValue,
      { new: true }
    );
    return res.status(200).json(updatedReport);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export default updateReport;
