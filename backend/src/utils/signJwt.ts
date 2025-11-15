import jwt from "jsonwebtoken";

export function signJwt(payload: object) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not defined");
  }

  return jwt.sign(
    payload,
    secret as jwt.Secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as jwt.SignOptions
  );
}
