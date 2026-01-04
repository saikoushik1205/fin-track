import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://koushiksai242_db_user:Koushiksai2006@fintrack.e7bmufn.mongodb.net/fintrack?retryWrites=true&w=majority";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Schemas
const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    personName: String,
    amount: Number,
    date: Date,
    note: String,
    status: String,
    type: String,
    amountReturned: Number,
    parentId: String,
  },
  { timestamps: true }
);

const ExpenseSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: String,
    amount: Number,
    category: String,
    date: Date,
    note: String,
    paymentMethod: String,
    parentId: String,
  },
  { timestamps: true }
);

const InterestSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    personName: String,
    principal: Number,
    interest: Number,
    totalAmount: Number,
    date: Date,
    remarks: String,
  },
  { timestamps: true }
);

const EarningSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    sourceName: String,
    earningName: String,
    amount: Number,
    date: Date,
    remarks: String,
  },
  { timestamps: true }
);

// Models
const Transaction = mongoose.model("Transaction", TransactionSchema);
const Expense = mongoose.model("Expense", ExpenseSchema);
const Interest = mongoose.model("Interest", InterestSchema);
const Earning = mongoose.model("Earning", EarningSchema);

// Helper function to get userId from email
const getUserId = (email) => email.replace(/[^a-zA-Z0-9]/g, "_");

// Routes - Transactions
app.get("/api/transactions/:userEmail", async (req, res) => {
  try {
    const userId = getUserId(req.params.userEmail);
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/transactions/:userEmail", async (req, res) => {
  try {
    const userId = getUserId(req.params.userEmail);
    const transaction = new Transaction({ ...req.body, userId });
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/transactions/:userEmail/:id", async (req, res) => {
  try {
    const userId = getUserId(req.params.userEmail);
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    );
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/transactions/:userEmail/:id", async (req, res) => {
  try {
    const userId = getUserId(req.params.userEmail);
    await Transaction.findOneAndDelete({ _id: req.params.id, userId });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes - Expenses
app.get("/api/expenses/:userEmail", async (req, res) => {
  try {
    const userId = getUserId(req.params.userEmail);
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/expenses/:userEmail", async (req, res) => {
  try {
    const userId = getUserId(req.params.userEmail);
    const expense = new Expense({ ...req.body, userId });
    await expense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/expenses/:userEmail/:id", async (req, res) => {
  try {
    const userId = getUserId(req.params.userEmail);
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    );
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/expenses/:userEmail/:id", async (req, res) => {
  try {
    const userId = getUserId(req.params.userEmail);
    await Expense.findOneAndDelete({ _id: req.params.id, userId });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes - Interest
app.get("/api/interest/:userEmail", async (req, res) => {
  try {
    const userId = getUserId(req.params.userEmail);
    const interest = await Interest.find({ userId }).sort({ date: -1 });
    res.json(interest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/interest/:userEmail", async (req, res) => {
  try {
    const userId = getUserId(req.params.userEmail);
    const interest = new Interest({ ...req.body, userId });
    await interest.save();
    res.json(interest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/interest/:userEmail/:id", async (req, res) => {
  try {
    const userId = getUserId(req.params.userEmail);
    const interest = await Interest.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    );
    res.json(interest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/interest/:userEmail/:id", async (req, res) => {
  try {
    const userId = getUserId(req.params.userEmail);
    await Interest.findOneAndDelete({ _id: req.params.id, userId });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes - Earnings
app.get("/api/earnings/:userEmail", async (req, res) => {
  try {
    const userId = getUserId(req.params.userEmail);
    const earnings = await Earning.find({ userId }).sort({ date: -1 });
    res.json(earnings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/earnings/:userEmail", async (req, res) => {
  try {
    const userId = getUserId(req.params.userEmail);
    const earning = new Earning({ ...req.body, userId });
    await earning.save();
    res.json(earning);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/earnings/:userEmail/:id", async (req, res) => {
  try {
    const userId = getUserId(req.params.userEmail);
    const earning = await Earning.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    );
    res.json(earning);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/earnings/:userEmail/:id", async (req, res) => {
  try {
    const userId = getUserId(req.params.userEmail);
    await Earning.findOneAndDelete({ _id: req.params.id, userId });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
