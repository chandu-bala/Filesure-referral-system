import { Schema, model, Document } from "mongoose";
import { Types } from "mongoose";
export interface IUser extends Document {
      _id: Types.ObjectId;  
  email: string;
  name?: string;
  passwordHash?: string;
  referralCode: string;
  credits: number;
  createdAt: Date;
  firstPurchaseAt?: Date | null;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String },
  passwordHash: { type: String },
  referralCode: { type: String, required: true, unique: true },
  credits: { type: Number, default: 0 },
  firstPurchaseAt: { type: Date, default: null },
  createdAt: { type: Date, default: () => new Date() },
});

export const User = model<IUser>("User", UserSchema);
