import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

// Initialize Firebase Admin
admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://fin-track-peach-psi.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI!;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Firebase Auth Middleware
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.body.userId = decodedToken.uid;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Import routes
import transactionRoutes from "./routes/transactions";
import expenseRoutes from "./routes/expenses";
import interestRoutes from "./routes/interest";
import earningsRoutes from "./routes/earnings";
import otherBalancesRoutes from "./routes/otherBalances";
import profileRoutes from "./routes/profile";

// Routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/interest", interestRoutes);
app.use("/api/earnings", earningsRoutes);
app.use("/api/other-balances", otherBalancesRoutes);
app.use("/api/profile", profileRoutes);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res
    .status(500)
    .json({ error: "Internal server error", message: err.message });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
