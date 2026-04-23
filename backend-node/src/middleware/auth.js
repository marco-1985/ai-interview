import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UserProfile } from "../models/UserProfile.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ success: false, message: "Missing token" });
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await UserProfile.findById(payload.sub).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}
