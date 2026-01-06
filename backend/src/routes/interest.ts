import express, { Request, Response } from "express";
import InterestTransaction from "../models/InterestTransaction";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const transactions = await InterestTransaction.find({ userId }).sort({
      date: -1,
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch interest transactions" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const transaction = new InterestTransaction({ ...req.body, userId });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to create interest transaction" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const transaction = await InterestTransaction.findOneAndUpdate(
      { _id: req.params.id, userId },
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

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const transaction = await InterestTransaction.findOneAndDelete({
      _id: req.params.id,
      userId,
    });
    if (!transaction)
      return res.status(404).json({ error: "Interest transaction not found" });
    res.json({ message: "Interest transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete interest transaction" });
  }
});

export default router;
