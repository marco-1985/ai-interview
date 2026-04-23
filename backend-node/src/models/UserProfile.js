import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    firebaseUid: { type: String, default: null }
  },
  { timestamps: true }
);

export const UserProfile = mongoose.model("UserProfile", userProfileSchema);
