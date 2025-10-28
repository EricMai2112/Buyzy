import { Request } from "express";
import mongoose from "mongoose";

export const getUserIdFromRequest = (
  req: Request
): mongoose.Types.ObjectId | null => {
  const idFromHeader = req.headers["x-user-id"] as string;
  const idFromParam = req.params.userId;
  const finalId = idFromHeader || idFromParam;

  if (!finalId) {
    return null;
  }

  try {
    return new mongoose.Types.ObjectId(finalId);
  } catch (e) {
    console.error("Invalid User ID format received:", finalId);
    return null;
  }
};
