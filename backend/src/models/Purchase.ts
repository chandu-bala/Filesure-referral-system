import { Schema, model, Document, Types } from "mongoose";

export interface IPurchase extends Document {
  userId: Types.ObjectId;
  amount: number;
  productId?: string;
  createdAt: Date;
  idempotencyKey?: string | null;
}

const PurchaseSchema = new Schema<IPurchase>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  amount: { type: Number, required: true },
  productId: { type: String },
  createdAt: { type: Date, default: () => new Date() },
  idempotencyKey: { type: String, default: null, index: true },
});

export const Purchase = model<IPurchase>("Purchase", PurchaseSchema);
