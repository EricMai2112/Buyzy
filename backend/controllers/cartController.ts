import { Request, Response } from "express";
import { Cart } from "../models/Cart";

export const getCarts = async (_: Request, res: Response) => {
  const carts = await Cart.find();
  res.json(carts);
};
