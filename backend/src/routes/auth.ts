import { Router } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
 // ✅ FIXED IMPORT
import { User } from "../models/User";
import { Referral } from "../models/Referral";
import { generateReferralCode } from "../utils/generateReferralCode";

const router = Router();

function getJwtSecret(): Secret {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set in environment");
  return secret as Secret;
}


// REGISTER
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, referralCode } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    let code = generateReferralCode(6);
    while (await User.findOne({ referralCode: code })) {
      code = generateReferralCode(6);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      name,
      passwordHash,
      referralCode: code,
    });

    await user.save();

    if (referralCode) {
      const referrer = await User.findOne({
        referralCode: referralCode.toUpperCase(),
      });

      if (referrer && referrer.id !== user.id) {
        await Referral.create({
          referrerId: referrer._id,
          referredId: user._id,
          code: referralCode.toUpperCase(),
          status: "pending",
          credited: false,
        });
      }
    }

    // ✅ FIXED jwt.sign
    const token = jwt.sign(
  { userId: String(user._id) },
  getJwtSecret(),
  {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as SignOptions
);


    const userSafe = {
      _id: user._id,
      email: user.email,
      name: user.name,
      referralCode: user.referralCode,
      credits: user.credits,
    };

    return res.json({ user: userSafe, token });
  } catch (err) {
    next(err);
  }
});

// LOGIN
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash)
      return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    // ✅ FIXED jwt.sign
    const token = jwt.sign(
  { userId: String(user._id) },
  getJwtSecret(),
  {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as SignOptions
);


    const userSafe = {
      _id: user._id,
      email: user.email,
      name: user.name,
      referralCode: user.referralCode,
      credits: user.credits,
    };

    return res.json({ user: userSafe, token });
  } catch (err) {
    next(err);
  }
});

export default router;
