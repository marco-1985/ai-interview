import { Router } from "express";
import mongoose from "mongoose";
import { Interview } from "../models/Interview.js";
import { generateInterviewQuestions } from "../data/questionBank.js";

const router = Router();

router.get("/generate", async (req, res) => {
  const count = Number(req.query.count || 5);
  const course = String(req.query.course || req.query.category || "BTECH").toUpperCase();
  const category = req.query.category || course;
  const level = req.query.level || "INTERMEDIATE";
  const type = req.query.type || "TECHNICAL";
  const interviewId = req.query.interviewId;

  if (interviewId) {
    if (!mongoose.isValidObjectId(interviewId)) {
      return res.status(400).json({ success: false, message: "Invalid interview id" });
    }
    const interview = await Interview.findOne({ _id: interviewId, userId: req.user.id });
    if (interview?.questions?.length) {
      return res.json({ success: true, data: interview.questions });
    }
  }

  const questions = generateInterviewQuestions({
    course,
    level,
    type,
    count,
    seed: `${req.user.id}-${interviewId || Date.now()}`
  }).map((item) => ({
    ...item,
    category
  }));

  return res.json({ success: true, data: questions });
});

export default router;
