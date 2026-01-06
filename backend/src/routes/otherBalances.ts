import express, { Request, Response } from "express";
import OtherBalance from "../models/OtherBalance";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const balances = await OtherBalance.find({ userId }).sort({
      updatedAt: -1,
    });
    res.json(balances);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch other balances" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const balance = new OtherBalance({ ...req.body, userId });
    await balance.save();
    res.status(201).json(balance);
  } catch (error) {
    res.status(500).json({ error: "Failed to create other balance" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const balance = await OtherBalance.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    );
    if (!balance)
      return res.status(404).json({ error: "Other balance not found" });
    res.json(balance);
  } catch (error) {
    res.status(500).json({ error: "Failed to update other balance" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const balance = await OtherBalance.findOneAndDelete({
      _id: req.params.id,
      userId,
    });
    if (!balance)
      return res.status(404).json({ error: "Other balance not found" });
    res.json({ message: "Other balance deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete other balance" });
  }
});

export default router;
