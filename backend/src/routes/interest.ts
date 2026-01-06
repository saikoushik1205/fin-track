import express, { Request, Response } from "express";
import InterestTransaction from "../models/InterestTransaction";
import { verifyToken } from "../server";

const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const interest = await InterestTransaction.find({
      userId: req.body.userId,
    }).sort({ date: -1 });
    res.json(interest);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch interest transactions" });
  }
});

router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const interest = new InterestTransaction({
      ...req.body,
      userId: req.body.userId,
    });
    await interest.save();
    res.status(201).json(interest);
  } catch (error) {
    res.status(500).json({ error: "Failed to create interest transaction" });
  }
});

router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const interest = await InterestTransaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.body.userId },
      req.body,
      { new: true }
    );
    if (!interest)
      return res.status(404).json({ error: "Interest transaction not found" });
    res.json(interest);
  } catch (error) {
    res.status(500).json({ error: "Failed to update interest transaction" });
  }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const interest = await InterestTransaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.body.userId,
    });
    if (!interest)
      return res.status(404).json({ error: "Interest transaction not found" });
    res.json({ message: "Interest transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete interest transaction" });
  }
});

export default router;
