import express from "express";

import {
  createOrUpdateAlumniProfile,
  getAllAlumni,
  getAlumniById,
} from "../controllers/alumniController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get and search all alumni
router.get(
  "/",
  protect,
  getAllAlumni
);

// Create or update an alumni profile
router.post(
  "/profile",
  protect,
  authorizeRoles("alumni"),
  createOrUpdateAlumniProfile
);
router.get(
  "/:id",
  protect,
  getAlumniById
);

export default router;