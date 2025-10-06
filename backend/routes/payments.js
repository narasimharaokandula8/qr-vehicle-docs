import express from "express";
import { authMiddleware } from "./auth.js";
import Payment from "../models/Payment.js";

const router = express.Router();

// Calculate fee based on type
router.post("/payments/calculate", authMiddleware, async (req, res) => {
  const base = Number(process.env.PAYMENT_BASE_FEE || 100);
  const { type } = req.body; // registration | modification
  if (!type || !["registration", "modification"].includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }
  const amount = type === "modification" ? base * 2 : base;
  return res.json({ amount, currency: "INR" });
});

// Record a payment (stub)
router.post("/payments/record", authMiddleware, async (req, res) => {
  try {
    const { type, amount, method = "upi", meta = {} } = req.body;
    if (!type || typeof amount !== "number") {
      return res.status(400).json({ message: "Missing type or amount" });
    }
    const payment = await Payment.create({
      userId: req.user.id,
      type,
      amount,
      method,
      status: "success",
      meta,
    });
    res.status(201).json({ message: "Payment recorded", payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment record failed" });
  }
});

export default router;