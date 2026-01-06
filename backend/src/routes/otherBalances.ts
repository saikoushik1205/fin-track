import express, { Request, Response } from "express";
import OtherBalance from "../models/OtherBalance";
import { verifyToken } from "../server";

const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const balances = await OtherBalance.find({ userId: req.body.userId }).sort({
      updatedAt: -1,
    });
    res.json(balances);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch balances" });
  }
});

router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const balance = new OtherBalance({ ...req.body, userId: req.body.userId });
    await balance.save();
    res.status(201).json(balance);
  } catch (error) {
    res.status(500).json({ error: "Failed to create balance" });
  }
});

router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const balance = await OtherBalance.findOneAndUpdate(
      { _id: req.params.id, userId: req.body.userId },
      req.body,
      { new: true }
    );
    if (!balance) return res.status(404).json({ error: "Balance not found" });
    res.json(balance);
  } catch (error) {
    res.status(500).json({ error: "Failed to update balance" });
  }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const balance = await OtherBalance.findOneAndDelete({
      _id: req.params.id,
      userId: req.body.userId,
    });
    if (!balance) return res.status(404).json({ error: "Balance not found" });
    res.json({ message: "Balance deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete balance" });
  }
});

export default router;
