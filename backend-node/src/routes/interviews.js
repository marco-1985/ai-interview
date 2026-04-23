import { Router } from "express";
import mongoose from "mongoose";
import { Interview } from "../models/Interview.js";
import { Result } from "../models/Result.js";
import { generateInterviewQuestions } from "../data/questionBank.js";
import { buildResultAnalytics, evaluateAnswer } from "../utils/evaluation.js";

const router = Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function validateInterviewId(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ success: false, message: "Invalid interview id" });
    return false;
  }
  return true;
}

router.post("/start", asyncHandler(async (req, res) => {
  const course = String(req.body.course || "BTECH").toUpperCase();
  const category = req.body.category || course;
  const level = req.body.level || "INTERMEDIATE";
  const type = req.body.type || "TECHNICAL";
  const questions = generateInterviewQuestions({
    course,
    level,
    type,
    count: 5,
    seed: `${req.user.id}-${Date.now()}`
  });

  const interview = await Interview.create({
    userId: req.user.id,
    course,
    category,
    level,
    type,
    questions,
    status: "CREATED"
  });
  return res.status(201).json({ success: true, data: interview });
}));

router.get("/history", asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 0);
  const size = Number(req.query.size || 10);
  const interviews = await Interview.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .skip(page * size)
    .limit(size);
  return res.json({ success: true, data: interviews });
}));

router.get("/active", asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ userId: req.user.id, status: { $in: ["CREATED", "IN_PROGRESS"] } })
    .sort({ updatedAt: -1 });
  return res.json({ success: true, data: interviews });
}));

router.get("/:id", asyncHandler(async (req, res) => {
  if (!validateInterviewId(req, res)) return;
  const interview = await Interview.findOne({ _id: req.params.id, userId: req.user.id });
  if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });
  return res.json({ success: true, data: interview });
}));

router.put("/:id/status", asyncHandler(async (req, res) => {
  if (!validateInterviewId(req, res)) return;
  const interview = await Interview.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { status: req.query.status || req.body.status || "IN_PROGRESS" },
    { new: true }
  );
  if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });
  return res.json({ success: true, data: interview });
}));

router.post("/:id/answer", asyncHandler(async (req, res) => {
  if (!validateInterviewId(req, res)) return;
  const interview = await Interview.findOne({ _id: req.params.id, userId: req.user.id });
  if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });

  const questionId = req.body.questionId;
  const questionDoc = interview.questions.find((item) => item.id === questionId);
  const questionText = req.body.question || questionDoc?.questionText || "Interview question";
  const answerText = req.body.userAnswer || req.body.answer || "";
  const evaluation = evaluateAnswer({ questionText, answerText });

  interview.answers.push({
    questionId,
    question: questionText,
    answer: answerText,
    timeTaken: Number(req.body.timeTaken || 0),
    score: evaluation.score,
    feedback: evaluation.feedback
  });
  await interview.save();
  return res.json({
    success: true,
    data: interview,
    answerFeedback: {
      questionId,
      score: evaluation.score,
      feedback: evaluation.feedback
    }
  });
}));

router.post("/:id/complete", asyncHandler(async (req, res) => {
  if (!validateInterviewId(req, res)) return;
  const interview = await Interview.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { status: "COMPLETED" },
    { new: true }
  );
  if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });

  const analytics = buildResultAnalytics(interview.answers);
  const result = await Result.findOneAndUpdate(
    { interviewId: interview._id },
    {
      interviewId: interview._id,
      userId: req.user.id,
      ...analytics,
      perQuestionFeedback: interview.answers.map((item) => ({
        questionId: item.questionId,
        question: item.question,
        score: item.score,
        feedback: item.feedback
      }))
    },
    { upsert: true, new: true }
  );
  return res.json({ success: true, data: { interview, result } });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  if (!validateInterviewId(req, res)) return;
  const deleted = await Interview.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) return res.status(404).json({ success: false, message: "Interview not found" });
  await Result.deleteOne({ interviewId: req.params.id });
  return res.json({ success: true, message: "Interview deleted" });
}));

export default router;
