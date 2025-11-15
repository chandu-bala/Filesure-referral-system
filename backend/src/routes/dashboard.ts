import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { Referral } from "../models/Referral";
import { Purchase } from "../models/Purchase";
import { User } from "../models/User";

const router = Router();

// GET /api/dashboard
router.get("/", authMiddleware, async (req: any, res, next) => {
  try {
    const user = req.user;

    // Referred users count
    const referredCount = await Referral.countDocuments({ referrerId: user._id });

    // Converted users count
    const convertedCount = await Referral.countDocuments({ referrerId: user._id, status: "converted" });

    // Credits
    const freshUser = await User.findById(user._id).select("credits referralCode");

    // List referred users
    const referredListRaw = await Referral.find({ referrerId: user._id }).populate("referredId", "email");

    const referredList = referredListRaw.map((r) => {
      const email = (r.referredId && (r.referredId as any).email) || "Pending";
      return { email, status: r.status };
    });

    return res.json({
      referredCount,
      convertedCount,
      credits: freshUser?.credits || 0,
      referralCode: freshUser?.referralCode || user.referralCode,
      referredList,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
