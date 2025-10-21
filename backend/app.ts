import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectDB } from "./config/db";

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoute";
import cartRoutes from "./routes/cartRoute";
import orderRoutes from "./routes/orderRoute";
import feedbackRoutes from "./routes/feedbackRoute";
import categoryRoutes from "./routes/categoryRoute";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
