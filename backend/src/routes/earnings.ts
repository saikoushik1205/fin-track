import express from "express";
import PersonalEarning from "../models/PersonalEarning";
import { verifyToken, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const earnings = await PersonalEarning.find({ userId: req.userId }).sort({
      date: -1,
    });
    res.json(earnings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch earnings" });
  }
});

router.post("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const earning = new PersonalEarning({ ...req.body, userId: req.userId });
    await earning.save();
    res.status(201).json(earning);
  } catch (error) {
    res.status(500).json({ error: "Failed to create earning" });
  }
});

router.put("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const earning = await PersonalEarning.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!earning) return res.status(404).json({ error: "Earning not found" });
    res.json(earning);
  } catch (error) {
    res.status(500).json({ error: "Failed to update earning" });
  }
});

router.delete("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const earning = await PersonalEarning.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!earning) return res.status(404).json({ error: "Earning not found" });
    res.json({ message: "Earning deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete earning" });
  }
});

export default router;
