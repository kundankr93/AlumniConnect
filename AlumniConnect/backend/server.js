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

// Load environment variables
dotenv.config();

const app = express();

/* ==========================
   CORS Configuration
========================== */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",

  // Old frontend (optional)
  "https://alumniconnect-frontend-d2uw.onrender.com",

  // Current Vercel frontend
  "https://alumni-connect-silk-two.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman and server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked Origin:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/* ==========================
   Middleware
========================== */

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* ==========================
   Rate Limiter
========================== */

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

/* ==========================
   Routes
========================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AlumniConnect API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/events", eventRoutes);

/* ==========================
   Error Middleware
========================== */

app.use(notFound);

app.use(errorHandler);

/* ==========================
   Start Server
========================== */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("CORS Enabled");
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();