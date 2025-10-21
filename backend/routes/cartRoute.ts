import express from "express";
import { getCarts } from "../controllers/cartController";

const router = express.Router();

router.get("/", getCarts);

export default router;
