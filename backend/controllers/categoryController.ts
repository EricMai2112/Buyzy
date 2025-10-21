// controllers/categoryController.ts (Tạo mới)
import { Request, Response } from "express";
import { Category } from "../models/Category";

// 🎯 Lấy tất cả danh mục
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// 🎯 Tạo danh mục mới (dùng để seeding dữ liệu)
export const createCategory = async (req: Request, res: Response) => {
  try {
    // req.body sẽ nhận { name: "Electronics", icon_url: "..." }
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err: any) {
    // Xử lý lỗi trùng lặp (unique: true)
    if (err.code === 11000) {
      return res.status(400).json({ error: "Category name already exists." });
    }
    console.error("Error creating category:", err);
    res.status(500).json({ error: "Failed to create category" });
  }
};
