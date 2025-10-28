import { Request, Response } from "express";
import { Product } from "../models/Product";

export const getProducts = async (req: Request, res: Response) => {
  const { minPrice, maxPrice } = req.query;

  let filter = {};

  if (minPrice || maxPrice) {
    filter = {
      price: {
        ...(minPrice && { $gte: parseFloat(minPrice as string) }),
        ...(maxPrice && { $lte: parseFloat(maxPrice as string) }),
      },
    };
  }

  try {
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err: any) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid product ID format" });
    }
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  // Dữ liệu sản phẩm mới được gửi trong req.body
  const productData = req.body;

  try {
    const newProduct = await Product.create(productData);
    // Trả về 201 Created
    res.status(201).json(newProduct);
  } catch (err: any) {
    // Xử lý lỗi validation hoặc lỗi DB khác
    res
      .status(400)
      .json({ error: "Failed to create product", details: err.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body; // Dữ liệu cập nhật

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true } // {new: true} trả về tài liệu đã cập nhật
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found for update." });
    }

    res.json(updatedProduct);
  } catch (err: any) {
    res
      .status(400)
      .json({ error: "Failed to update product", details: err.message });
  }
};

// 🎯 3. DELETE PRODUCT (DELETE /api/products/:id)
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await Product.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: "Product not found for deletion." });
    }

    // Trả về 204 No Content (hoặc 200 OK với thông báo)
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete product." });
  }
};
