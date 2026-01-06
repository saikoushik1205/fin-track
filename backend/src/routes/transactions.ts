import express, { Request, Response } from "express";
import Transaction from "../models/Transaction";
import { verifyToken } from "../server";

const router = express.Router();

// Get all transactions for user
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find({
      userId: req.body.userId,
    }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// Create transaction
router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      userId: req.body.userId,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

// Update transaction
router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.body.userId },
      req.body,
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

// Delete transaction
router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.body.userId,
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

export default router;
