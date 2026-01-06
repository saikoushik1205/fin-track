import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  userId: string;
  personName: string;
  amount: number;
  date: Date;
  note?: string;
  status: "pending" | "partial" | "paid";
  type: "lending" | "borrowing";
  amountReturned?: number;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    personName: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    note: { type: String },
    status: {
      type: String,
      enum: ["pending", "partial", "paid"],
      required: true,
    },
    type: { type: String, enum: ["lending", "borrowing"], required: true },
    amountReturned: { type: Number, default: 0 },
    parentId: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
