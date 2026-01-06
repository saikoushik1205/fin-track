import mongoose, { Schema, Document } from "mongoose";

interface IOtherTransaction {
  id: string;
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
  createdAt: Date;
}

const OtherTransactionSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  note: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

const OtherBalanceSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    transactions: [OtherTransactionSchema],
    updatedAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOtherBalance>(
  "OtherBalance",
  OtherBalanceSchema
);
