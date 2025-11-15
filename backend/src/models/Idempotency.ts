import { Schema, model, Document } from "mongoose";

export interface IIdempotency extends Document {
  key: string;
  response?: any;
  createdAt: Date;
}

const IdempotencySchema = new Schema<IIdempotency>({
  key: { type: String, required: true, unique: true },
  response: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: () => new Date() },
});

export const Idempotency = model<IIdempotency>("Idempotency", IdempotencySchema);
