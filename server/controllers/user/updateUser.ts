import { Response } from "express";
import { IRequestWithUserData } from "../../utils/checkHeaders";
import User from "../../models/User";

const updateUser = async (req: IRequestWithUserData, res: Response) => {
  try {
    const { body: updatedValue } = req;

    if (!updatedValue.id) {
      return res.status(400).json({ message: "Invalid value" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      updatedValue.id,
      updatedValue,
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export default updateUser;
