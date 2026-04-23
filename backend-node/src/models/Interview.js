import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserProfile", required: true, index: true },
    course: { type: String, default: "BTECH", index: true },
    category: { type: String, default: "GENERAL" },
    level: { type: String, default: "INTERMEDIATE" },
    type: { type: String, default: "TECHNICAL" },
    status: { type: String, default: "CREATED" },
    questions: [
      {
        id: { type: String },
        questionText: { type: String },
        course: { type: String },
        level: { type: String },
        type: { type: String }
      }
    ],
    answers: [
      {
        questionId: String,
        question: String,
        answer: String,
        timeTaken: Number,
        score: Number,
        feedback: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const Interview = mongoose.model("Interview", interviewSchema);
