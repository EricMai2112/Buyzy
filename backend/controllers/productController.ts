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
