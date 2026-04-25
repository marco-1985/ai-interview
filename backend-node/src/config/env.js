import dotenv from "dotenv";

dotenv.config({ override: true });

const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, "").toLowerCase();

export const env = {
  port: Number(process.env.PORT || 8081),
  nodeEnv: process.env.NODE_ENV || "development",
  frontendOrigins: (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean),
  corsAllowVercelApp:
    String(process.env.CORS_ALLOW_VERCEL_APP || "false").toLowerCase() === "true",
  mongoUri: process.env.MONGODB_URI,
  mongoDb: process.env.MONGODB_DB || "interviewiq",
  jwtSecret: process.env.JWT_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  firebaseWebApiKey: process.env.FIREBASE_WEB_API_KEY
};

export function validateEnv() {
  const required = ["mongoUri", "jwtSecret"];
  const missing = required.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}
