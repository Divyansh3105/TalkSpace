import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./lib/db.js";
import { sanitizeInput } from "./middleware/sanitize.middleware.js";
import rateLimit from "express-rate-limit";

// ── Fail fast if required environment variables are missing ──────────────────
const REQUIRED_ENV_VARS = [
  "MONGODB_URI",
  "JWT_SECRET",
  "STREAM_API_KEY",
  "STREAM_API_SECRET",
  "CORS_ORIGIN",
];
REQUIRED_ENV_VARS.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
// ────────────────────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 5001;


const __dirname = path.resolve();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json());
app.use(cookieParser());
app.use(sanitizeInput);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // max 20 requests per window per IP
  standardHeaders: true,     // send RateLimit-* headers
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log("URI:", process.env.MONGODB_URI);
    }

    await connectDB(); // connect first

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
