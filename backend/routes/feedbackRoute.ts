import express from "express";
import { getFeedbacks } from "../controllers/feedbackController";

const router = express.Router();

router.get("/", getFeedbacks);

export default router;
