import express from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/productController";
import { checkAdmin } from "../utils/authMiddleware";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

//role admin
router.post("/", checkAdmin, createProduct);
router.put("/:id", checkAdmin, updateProduct);
router.delete("/:id", checkAdmin, deleteProduct);
export default router;
