import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserProfile } from "../models/UserProfile.js";
import { signAccessToken, signRefreshToken } from "../utils/tokens.js";
import { env } from "../config/env.js";
import { createFirebaseUser, verifyFirebasePassword } from "../config/firebase.js";

const router = Router();

function authPayload(user) {
  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());
  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  };
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "name, email and password are required" });
    }

    const firebaseUid = await createFirebaseUser({
      email: email.toLowerCase(),
      password,
      displayName: name
    });

    const passwordHash = await bcrypt.hash(password, 10);
    const normalizedEmail = email.toLowerCase();
    let user = await UserProfile.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    user = await UserProfile.create({
      name,
      email: normalizedEmail,
      passwordHash,
      firebaseUid
    });

    return res.status(201).json({ success: true, message: "Registered", data: authPayload(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase();
    const firebaseAuth = await verifyFirebasePassword(normalizedEmail, password || "");
    if (!firebaseAuth.ok) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    let user = await UserProfile.findOne({ email: normalizedEmail });
    if (!user) {
      const passwordHash = await bcrypt.hash(password || "", 10);
      user = await UserProfile.create({
        name: normalizedEmail.split("@")[0],
        email: normalizedEmail,
        passwordHash,
        firebaseUid: firebaseAuth.uid
      });
    } else if (!user.firebaseUid && firebaseAuth.uid) {
      user.firebaseUid = firebaseAuth.uid;
      await user.save();
    }

    user.passwordHash = await bcrypt.hash(password || "", 10);
    await user.save();

    return res.json({ success: true, message: "Login success", data: authPayload(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const payload = jwt.verify(refreshToken, env.jwtSecret);
    if (payload.type !== "refresh") {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }
    const accessToken = signAccessToken(payload.sub);
    return res.json({ success: true, data: { accessToken } });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
});

router.post("/forgot-password", async (req, res) => {
  return res.json({ success: true, message: "Endpoint ready. Wire email provider when needed." });
});

router.post("/reset-password", async (req, res) => {
  return res.json({ success: true, message: "Endpoint ready. Wire token verification when needed." });
});

router.post("/verify-email", async (req, res) => {
  return res.json({ success: true, message: "Endpoint ready. Wire verification logic when needed." });
});

export default router;
