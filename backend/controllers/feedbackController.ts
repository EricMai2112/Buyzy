import { Request, Response } from "express";
import { Feedback } from "../models/Feedback";

export const getFeedbacks = async (_: Request, res: Response) => {
  const feedbacks = await Feedback.find();
  res.json(feedbacks);
};
