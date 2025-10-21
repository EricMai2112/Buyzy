// productRoute.ts
import express from "express";
import {
  getProducts,
  getProductById, // ⬅️ Import hàm mới
} from "../controllers/productController";

const router = express.Router();

// Route lấy TẤT CẢ sản phẩm (GET /api/products)
router.get("/", getProducts);

// 🎯 ROUTE MỚI: Lấy sản phẩm theo ID (GET /api/products/:id)
router.get("/:id", getProductById);

export default router;
