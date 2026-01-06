import express, { Request, Response } from "express";
import Profile from "../models/Profile";
import { verifyToken } from "../server";

const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findOne({ userId: req.body.userId });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.body.userId },
      { ...req.body, lastLoginAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to save profile" });
  }
});

export default router;
