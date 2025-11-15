import { Schema, model, Document, Types } from "mongoose";

export type ReferralStatus = "pending" | "converted" | "cancelled";

export interface IReferral extends Document {
  referrerId: Types.ObjectId;
  referredId: Types.ObjectId | null;
  code: string;
  status: ReferralStatus;
  credited: boolean;
  createdAt: Date;
  convertedAt?: Date | null;
}

const ReferralSchema = new Schema<IReferral>({
  referrerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  referredId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  code: { type: String, required: true, index: true },
  status: { type: String, enum: ["pending", "converted", "cancelled"], default: "pending" },
  credited: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => new Date() },
  convertedAt: { type: Date, default: null },
});

ReferralSchema.index({ referrerId: 1, status: 1 });

export const Referral = model<IReferral>("Referral", ReferralSchema);
