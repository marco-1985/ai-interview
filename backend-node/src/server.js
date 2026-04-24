import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env, validateEnv } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { initFirebaseAdmin } from "./config/firebase.js";
import authRoutes from "./routes/auth.js";
import interviewRoutes from "./routes/interviews.js";
import questionRoutes from "./routes/questions.js";
import resultRoutes from "./routes/results.js";
import { requireAuth } from "./middleware/auth.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.frontendOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json({ strict: false }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Node backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/interviews", requireAuth, interviewRoutes);
app.use("/api/questions", requireAuth, questionRoutes);
app.use("/api/results", requireAuth, resultRoutes);

app.use((error, req, res, next) => {
  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON payload" });
  }
  console.error(error);
  res.status(500).json({ success: false, message: "Internal server error" });
});

async function start() {
  validateEnv();
  await connectDb();
  initFirebaseAdmin();

  app.listen(env.port, () => {
    console.log(`Backend listening on http://localhost:${env.port}`);
   });
}

start().catch((error) => {
  console.error("Failed to start backend:", error.message);
  process.exit(1);
});
