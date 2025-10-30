import { Request, Response } from "express";
import { Product } from "../models/Product";
import mongoose from "mongoose";

export const getProducts = async (req: Request, res: Response) => {
  const { minPrice, maxPrice, category } = req.query;

  let filter: any = {};

  if (category) {
    const categoryString = category as string;
    const categoryIdsToFind: (string | mongoose.Types.ObjectId)[] = [
      categoryString,
    ];

    try {
      categoryIdsToFind.push(new mongoose.Types.ObjectId(categoryString));
    } catch (e) {}

    filter.category_id = { $in: categoryIdsToFind };
  }
  if (minPrice || maxPrice) {
    const priceFilter: any = {};
    if (minPrice) {
      priceFilter.$gte = parseFloat(minPrice as string);
    }
    if (maxPrice) {
      priceFilter.$lte = parseFloat(maxPrice as string);
    }

    filter.price = priceFilter;
  }

  try {
    console.log("DEBUG: Final Mongoose Filter:", JSON.stringify(filter));
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
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
  const productData = req.body;

  try {
    const newProduct = await Product.create(productData);
    res.status(201).json(newProduct);
  } catch (err: any) {
    res
      .status(400)
      .json({ error: "Failed to create product", details: err.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

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

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await Product.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: "Product not found for deletion." });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete product." });
  }
};
