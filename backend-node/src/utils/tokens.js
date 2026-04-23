import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAccessToken(userId) {
  return jwt.sign({ sub: userId, type: "access" }, env.jwtSecret, {
    expiresIn: env.jwtAccessExpiresIn
  });
}

export function signRefreshToken(userId) {
  return jwt.sign({ sub: userId, type: "refresh" }, env.jwtSecret, {
    expiresIn: env.jwtRefreshExpiresIn
  });
}
