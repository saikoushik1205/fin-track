import express from "express";
import Expense from "../models/Expense";
import { verifyToken, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

router.post("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const expense = new Expense({ ...req.body, userId: req.userId });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: "Failed to create expense" });
  }
});

router.put("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: "Failed to update expense" });
  }
});

router.delete("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

export default router;
