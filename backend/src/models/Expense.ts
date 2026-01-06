import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  userId: string;
  category: string;
  amount: number;
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
