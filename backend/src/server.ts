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
const MONGODB_URI = process.env.MONGODB_URI || "";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Firebase Auth Middleware
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).userId = decodedToken.uid;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

// Import routes
import transactionRoutes from "./routes/transactions";
import expenseRoutes from "./routes/expenses";
import interestRoutes from "./routes/interest";
import earningsRoutes from "./routes/earnings";
import otherBalancesRoutes from "./routes/otherBalances";

// Use routes
app.use("/api/transactions", authenticateUser, transactionRoutes);
app.use("/api/expenses", authenticateUser, expenseRoutes);
app.use("/api/interest", authenticateUser, interestRoutes);
app.use("/api/earnings", authenticateUser, earningsRoutes);
app.use("/api/other-balances", authenticateUser, otherBalancesRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
