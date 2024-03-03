import { Request, Response } from 'express';
import User, { IUser } from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const getUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  };


export default getUsers