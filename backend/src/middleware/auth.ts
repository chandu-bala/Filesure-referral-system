import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser, User } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing Authorization header" });

  const token = auth.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid Authorization header" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    // attach user (without passwordHash)
    User.findById(payload.userId)
      .select("-passwordHash")
      .then((user) => {
        if (!user) return res.status(401).json({ error: "Invalid token user" });
        req.user = user;
        next();
      })
      .catch((err) => next(err));
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
