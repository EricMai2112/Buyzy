import { Request, Response, NextFunction } from "express";
import { getUserIdFromRequest } from "../utils/getUserIdFromRequest";
import { User } from "../models/User";

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserIdFromRequest(req);

  if (!userId) {
    return res.status(401).json({ error: "Không được phép (Thiếu ID)." });
  }

  try {
    const user = await User.findById(userId);

    if (user && user.role === "admin") {
      next();
    } else {
      res.status(403).json({ error: "Truy cập bị cấm (Yêu cầu quyền Admin)." });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi xác thực vai trò." });
  }
};
