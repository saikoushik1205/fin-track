import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

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
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

connectDB();

// Routes
import transactionRoutes from "./routes/transactions";
import expenseRoutes from "./routes/expenses";
import interestRoutes from "./routes/interest";
import earningsRoutes from "./routes/earnings";
import otherBalancesRoutes from "./routes/otherBalances";

app.use("/api/transactions", transactionRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/interest", interestRoutes);
app.use("/api/earnings", earningsRoutes);
app.use("/api/other-balances", otherBalancesRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
