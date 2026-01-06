import mongoose, { Schema, Document } from "mongoose";

interface IOtherTransaction {
  type: "credit" | "debit";
  note: string;
  amount: number;
  date: Date;
}

export interface IOtherBalance extends Document {
  userId: string;
  name: string;
  amount: number;
  updatedAt: Date;
  transactions: IOtherTransaction[];
}

const OtherTransactionSchema = new Schema(
  {
    type: { type: String, enum: ["credit", "debit"], required: true },
    note: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { _id: true }
);

const OtherBalanceSchema = new Schema<IOtherBalance>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now },
    transactions: [OtherTransactionSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IOtherBalance>(
  "OtherBalance",
  OtherBalanceSchema
);
