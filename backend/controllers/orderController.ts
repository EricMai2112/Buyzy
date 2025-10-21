import { Request, Response } from "express";
import { Order } from "../models/Order";

export const getOrders = async (_: Request, res: Response) => {
  const orders = await Order.find();
  res.json(orders);
};
