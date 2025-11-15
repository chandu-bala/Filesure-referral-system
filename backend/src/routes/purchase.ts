import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/auth";
import { Purchase } from "../models/Purchase";
import { Referral } from "../models/Referral";
import { User } from "../models/User";
import { Idempotency } from "../models/Idempotency";

const router = Router();

// POST /api/purchases
router.post("/", authMiddleware, async (req: any, res, next) => {
  const session = await mongoose.startSession();
  try {
    const user = req.user; // from auth middleware
    const amount: number = Number(req.body.amount || 0);
    const idempotencyKey = (req.headers["idempotency-key"] as string) || null;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Idempotency: if key provided and exists, return stored response
    if (idempotencyKey) {
      const existing = await Idempotency.findOne({ key: idempotencyKey });
      if (existing) {
        return res.json({ message: "Already processed", data: existing.response });
      }
    }

    // Start transaction
    session.startTransaction();

    // Check if user already has purchases (first purchase triggers credits only)
    const priorPurchase = await Purchase.findOne({ userId: user._id }).session(session);

    const purchaseDoc = await Purchase.create(
      [
        {
          userId: user._id,
          amount,
          idempotencyKey: idempotencyKey || null,
        },
      ],
      { session }
    );

    let creditApplied = false;

    // If no prior purchases -> first purchase
    if (!priorPurchase) {
      // Look for a referral where referredId == user._id and credited == false
      const referral = await Referral.findOne({ referredId: user._id, credited: false }).session(session);

      if (referral) {
        // Update referrer credits and referred credits atomically
        const creditAmount = Number(process.env.CREDIT_AMOUNT || 2);

        // Increase both users credits and set referred.firstPurchaseAt
        await User.updateOne({ _id: referral.referrerId }, { $inc: { credits: creditAmount } }).session(session);
        await User.updateOne({ _id: user._id }, { $inc: { credits: creditAmount }, $set: { firstPurchaseAt: new Date() } }).session(session);

        // Mark referral converted and credited
        referral.status = "converted";
        referral.credited = true;
        referral.convertedAt = new Date();
        await referral.save({ session });

        creditApplied = true;
      } else {
        // If no referral, just set user's firstPurchaseAt
        await User.updateOne({ _id: user._id }, { $set: { firstPurchaseAt: new Date() } }).session(session);
      }
    }

    // Store idempotency response (optional)
    if (idempotencyKey) {
      await Idempotency.create([{ key: idempotencyKey, response: { purchaseId: purchaseDoc[0]._id, creditApplied } }], { session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.json({ success: true, purchaseId: purchaseDoc[0]._id, creditApplied });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
});

export default router;
