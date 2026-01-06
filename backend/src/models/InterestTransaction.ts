import mongoose, { Schema, Document } from "mongoose";

export interface IInterestTransaction extends Document {
  userId: string;
  personName: string;
  principal: number;
  interest: number;
  totalAmount: number;
  date: Date;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterestTransactionSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    personName: { type: String, required: true },
    principal: { type: Number, required: true },
    interest: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    date: { type: Date, required: true },
    remarks: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IInterestTransaction>(
  "InterestTransaction",
  InterestTransactionSchema
);
