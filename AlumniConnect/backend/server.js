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

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",

  "https://alumniconnect-frontend-d2uw.onrender.com",

  // Vercel frontend
  "https://alumni-connect-silk-two.vercel.app",
];

// CORS middleware
app.use(
  cors({
    origin: function (
      origin,
      callback
    ) {
      // Allow requests without an origin,
      // such as Postman
      if (
        !origin ||
        allowedOrigins.includes(
          origin
        )
      ) {
        return callback(
          null,
          true
        );
      }

      console.log(
        "Blocked CORS origin:",
        origin
      );

      return callback(
        new Error(
          "Not allowed by CORS"
        )
      );
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

// Security headers
app.use(helmet());

// Parse JSON request body
app.use(
  express.json()
);

// Limit repeated API requests
const apiLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    max: 200,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,

      message:
        "Too many requests. Please try again later.",
    },
  });

// Apply rate limiter
// to all API routes
app.use(
  "/api",
  apiLimiter
);

// Home route
app.get(
  "/",
  (req, res) => {
    return res
      .status(200)
      .json({
        success: true,

        message:
          "AlumniConnect API is running",
      });
  }
);

// Authentication routes
app.use(
  "/api/auth",
  authRoutes
);

// Alumni routes
app.use(
  "/api/alumni",
  alumniRoutes
);

// Mentorship routes
app.use(
  "/api/mentorship",
  mentorshipRoutes
);

// Community post routes
app.use(
  "/api/posts",
  postRoutes
);

// Connection routes
app.use(
  "/api/connections",
  connectionRoutes
);

// Event routes
app.use(
  "/api/events",
  eventRoutes
);

// These middleware must remain
// after all API routes
app.use(
  notFound
);

app.use(
  errorHandler
);

// Server port
const PORT =
  process.env.PORT ||
  5000;

// Connect database
// and start server
const startServer =
  async () => {
    try {
      await connectDB();

      app.listen(
        PORT,
        () => {
          console.log(
            `Server is running on port ${PORT}`
          );

          console.log(
            "CORS enabled for deployed frontend"
          );
        }
      );
    } catch (error) {
      console.error(
        `Failed to start server: ${error.message}`
      );

      process.exit(1);
    }
  };

startServer();