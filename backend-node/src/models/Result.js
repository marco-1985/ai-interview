import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Interview", required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserProfile", required: true, index: true },
    overallScore: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    technicalScore: { type: Number, default: 0 },
    problemSolvingScore: { type: Number, default: 0 },
    passFail: { type: Boolean, default: false },
    grade: { type: String, default: "F" },
    strengths: { type: String, default: "" },
    weaknesses: { type: String, default: "" },
    improvements: { type: String, default: "" },
    summary: { type: String, default: "Result generated successfully." },
    perQuestionFeedback: [
      {
        questionId: String,
        question: String,
        score: Number,
        feedback: String
      }
    ]
  },
  { timestamps: true }
);

export const Result = mongoose.model("Result", resultSchema);
