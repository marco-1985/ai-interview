import { Router } from "express";
import mongoose from "mongoose";
import { Result } from "../models/Result.js";

const router = Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get("/history", asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 0);
  const size = Number(req.query.size || 10);
  const results = await Result.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .skip(page * size)
    .limit(size);
  return res.json({ success: true, data: results });
}));

router.get("/:interviewId", asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.interviewId)) {
    return res.status(400).json({ success: false, message: "Invalid interview id" });
  }
  const result = await Result.findOne({ interviewId: req.params.interviewId, userId: req.user.id });
  if (!result) return res.status(404).json({ success: false, message: "Result not found" });
  return res.json({ success: true, data: result });
}));

export default router;
