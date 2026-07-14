import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import alumniRoutes from "./routes/alumniRoutes.js";
import mentorshipRoutes from "./routes/mentorshipRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// Limit repeated API requests
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// General middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "AlumniConnect API is running",
  });
});

// API routes
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/alumni",
  alumniRoutes
);

app.use(
  "/api/mentorship",
  mentorshipRoutes
);

app.use(
  "/api/posts",
  postRoutes
);

app.use(
  "/api/connections",
  connectionRoutes
);

app.use(
  "/api/events",
  eventRoutes
);

// These must always remain after all routes
app.use(notFound);

app.use(errorHandler);

const PORT =
  process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      `Failed to start server: ${error.message}`
    );

    process.exit(1);
  }
};

startServer();