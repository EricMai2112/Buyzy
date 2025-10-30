import { Request, Response } from "express";
import { User } from "../models/User";

export const getUsers = async (_: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  if (!req.body.name) {
    req.body.name = req.body.email ? req.body.email.split("@")[0] : "New User";
  }
  try {
    const user = await User.create(req.body);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Email đã tồn tại. Vui lòng đăng nhập." });
    }
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Lỗi Server khi đăng ký." });
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

    if (user.password !== password) {
      return res.status(401).json({ error: "Mật khẩu không đúng." });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi Server khi đăng nhập." });
  }
};
