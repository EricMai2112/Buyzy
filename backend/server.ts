import express, { Request, Response } from "express";
import { MongoClient, Db, ObjectId } from "mongodb";
import cors from "cors";
import productsRouter from "./src/routes/products";
import cartsRouter from "./src/routes/carts";
import ordersRouter from "./src/routes/orders";
import feedbacksRouter from "./src/routes/feedbacks";

const app = express();
app.use(cors({ origin: "http://192.168.1.x:19006" })); // Thay IP Expo
app.use(express.json());

const url = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbName = "ecommerce";

let db: Db;

async function connectDB() {
  const client = new MongoClient(url);
  await client.connect();
  console.log("Connected to MongoDB");
  db = client.db(dbName);

  (productsRouter as any).setDb(db);
  (cartsRouter as any).setDb(db);
  (ordersRouter as any).setDb(db);
  (feedbacksRouter as any).setDb(db);
  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/feedbacks", feedbacksRouter);
}

connectDB().catch(console.error);

app.listen(5000, () => console.log("API running on port 5000"));
