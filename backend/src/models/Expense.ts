import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  userId: string;
  category: string;
  amount: number;
  date: Date;
  description?: string;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    userId: { type: String, required: true, index: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
