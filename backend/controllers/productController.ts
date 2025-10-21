// productController.ts
import { Request, Response } from "express";
import { Product } from "../models/Product";

export const getProducts = async (_: Request, res: Response) => {
  const products = await Product.find();
  res.json(products);
};

// 🎯 HÀM MỚI: Lấy sản phẩm theo ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Tìm sản phẩm bằng ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err: any) {
    // Thường bắt lỗi ID không hợp lệ (CastError)
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid product ID format" });
    }
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};
