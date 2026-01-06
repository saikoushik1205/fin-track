import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

const ProfileSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    displayName: { type: String, required: true },
    photoURL: { type: String },
    createdAt: { type: Date, required: true },
    lastLoginAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProfile>("Profile", ProfileSchema);
