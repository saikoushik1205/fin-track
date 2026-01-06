import express, { Request, Response } from "express";
import PersonalEarning from "../models/PersonalEarning";
import { verifyToken } from "../server";

const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const earnings = await PersonalEarning.find({
      userId: req.body.userId,
    }).sort({ date: -1 });
    res.json(earnings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch earnings" });
  }
});

router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const earning = new PersonalEarning({
      ...req.body,
      userId: req.body.userId,
    });
    await earning.save();
    res.status(201).json(earning);
  } catch (error) {
    res.status(500).json({ error: "Failed to create earning" });
  }
});

router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const earning = await PersonalEarning.findOneAndUpdate(
      { _id: req.params.id, userId: req.body.userId },
      req.body,
      { new: true }
    );
    if (!earning) return res.status(404).json({ error: "Earning not found" });
    res.json(earning);
  } catch (error) {
    res.status(500).json({ error: "Failed to update earning" });
  }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const earning = await PersonalEarning.findOneAndDelete({
      _id: req.params.id,
      userId: req.body.userId,
    });
    if (!earning) return res.status(404).json({ error: "Earning not found" });
    res.json({ message: "Earning deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete earning" });
  }
});

export default router;
