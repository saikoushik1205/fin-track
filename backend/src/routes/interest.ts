import express from "express";
import InterestTransaction from "../models/InterestTransaction";
import { verifyToken, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const transactions = await InterestTransaction.find({
      userId: req.userId,
    }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch interest transactions" });
  }
});

router.post("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const transaction = new InterestTransaction({
      ...req.body,
      userId: req.userId,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to create interest transaction" });
  }
});

router.put("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const transaction = await InterestTransaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!transaction)
      return res.status(404).json({ error: "Interest transaction not found" });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to update interest transaction" });
  }
});

router.delete("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const transaction = await InterestTransaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!transaction)
      return res.status(404).json({ error: "Interest transaction not found" });
    res.json({ message: "Interest transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete interest transaction" });
  }
});

export default router;
