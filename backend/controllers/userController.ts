import { Request, Response } from "express";
import { User } from "../models/User";

export const getUsers = async (_: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Vui lòng nhập email và mật khẩu." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Tài khoản không tồn tại." });
    }

    // 🚨 LƯU Ý QUAN TRỌNG: Đây là cách so sánh mật khẩu KHÔNG MÃ HÓA.
    // TRONG THỰC TẾ, HÃY DÙNG bcrypt.compare(password, user.password).
    if (user.password !== password) {
      return res.status(401).json({ error: "Mật khẩu không đúng." });
    }

    // ✅ Đăng nhập thành công, trả về ID và tên user
    return res.json({
      _id: user._id,
      name: user.name,
      // TRONG THỰC TẾ, HÃY TRẢ VỀ JWT TOKEN
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi Server khi đăng nhập." });
  }
};
