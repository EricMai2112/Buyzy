// routes/categoryRoute.ts (Tạo mới)
import express from "express";
import {
  getCategories,
  createCategory,
} from "../controllers/categoryController";

const router = express.Router();

// GET /api/categories: Lấy tất cả danh mục
router.get("/", getCategories);

// POST /api/categories: Tạo danh mục mới
router.post("/", createCategory);

export default router;
