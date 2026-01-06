import mongoose, { Schema, Document } from "mongoose";

export interface IPersonalEarning extends Document {
  userId: string;
  sourceName: string;
  amount: number;
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PersonalEarningSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    sourceName: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IPersonalEarning>(
  "PersonalEarning",
  PersonalEarningSchema
);
