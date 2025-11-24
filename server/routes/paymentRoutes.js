import express from "express";
import { createCheckoutSession } from "../controllers/paymentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-checkout-session", authMiddleware, createCheckoutSession);

export default router;
