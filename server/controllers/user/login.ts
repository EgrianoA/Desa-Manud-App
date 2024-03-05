import { Request, Response } from "express";
import User, { IUser, IUserData } from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pick } from "lodash";

const login = async (req: Request, res: Response) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const userData = await User.findOne({
      $or: [
        {
          email: { $regex: new RegExp(usernameOrEmail, "i") },
        },
        {
          username: { $regex: new RegExp(usernameOrEmail, "i") },
        },
      ],
    });

    if (!userData) {
      return res
        .status(400)
        .json({ message: "User does not exist / password is not match" });
    }

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "User does not exist / password is not match" });
    }

    const loggedUserData: IUserData = pick(userData, [
      "username",
      "email",
      "userFullName",
      "role",
    ]);

    const token = jwt.sign(
      { userData: loggedUserData },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ data: { user: loggedUserData, token: token } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export default login;
