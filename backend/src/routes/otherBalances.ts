import express from "express";
import OtherBalance from "../models/OtherBalance";
import { verifyToken, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const balances = await OtherBalance.find({ userId: req.userId }).sort({
      updatedAt: -1,
    });
    res.json(balances);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch balances" });
  }
});

router.post("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const balance = new OtherBalance({ ...req.body, userId: req.userId });
    await balance.save();
    res.status(201).json(balance);
  } catch (error) {
    res.status(500).json({ error: "Failed to create balance" });
  }
});

router.put("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const balance = await OtherBalance.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!balance) return res.status(404).json({ error: "Balance not found" });
    res.json(balance);
  } catch (error) {
    res.status(500).json({ error: "Failed to update balance" });
  }
});

router.delete("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const balance = await OtherBalance.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!balance) return res.status(404).json({ error: "Balance not found" });
    res.json({ message: "Balance deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete balance" });
  }
});

export default router;
