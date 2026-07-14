import express from "express";

import {
  registerUser,
  loginUser,
  getMyProfile,
} from "../controllers/authController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, getMyProfile);

// Only students can access this route
router.get(
  "/student-only",
  protect,
  authorizeRoles("student"),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome to the student-only route",
      user: {
        name: req.user.name,
        role: req.user.role,
      },
    });
  }
);

// Only alumni can access this route
router.get(
  "/alumni-only",
  protect,
  authorizeRoles("alumni"),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome to the alumni-only route",
      user: {
        name: req.user.name,
        role: req.user.role,
      },
    });
  }
);

export default router;