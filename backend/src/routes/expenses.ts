import express, { Request, Response } from "express";
import Expense from "../models/Expense";
import { verifyToken } from "../server";

const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find({ userId: req.body.userId }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const expense = new Expense({ ...req.body, userId: req.body.userId });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: "Failed to create expense" });
  }
});

router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.body.userId },
      req.body,
      { new: true }
    );
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: "Failed to update expense" });
  }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.body.userId,
    });
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

export default router;
