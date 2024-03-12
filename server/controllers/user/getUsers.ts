import { Request, Response } from "express";
import User, { IUser } from "../../models/User";
import { IRequestWithUserData } from "../../utils/checkHeaders";

const getUsers = async (req: IRequestWithUserData, res: Response) => {
  try {
    const { page: pageParam, size: sizeParam, query } = req.query;
    const page = (pageParam as unknown as number) || 1;
    const size = (sizeParam as unknown as number) || 10;
    const filterQuery = {};

    const users = await User.find(filterQuery)
      .limit(size)
      .skip((page - 1) * size);

    const count = await User.countDocuments(filterQuery);
    return res.status(200).json({ count: count || 0, data: users });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export default getUsers;
