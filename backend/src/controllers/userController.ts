import { Request, Response } from 'express';
import User from '../models/User';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('username _id');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  } 
}