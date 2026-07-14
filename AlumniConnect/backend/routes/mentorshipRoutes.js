import express from "express";

import {
  sendMentorshipRequest,
  getReceivedRequests,
  updateRequestStatus,
  getSentRequests,
} from "../controllers/mentorshipController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Alumni views received requests
router.get(
  "/received",
  protect,
  authorizeRoles("alumni"),
  getReceivedRequests
);

// Student views sent requests
router.get(
  "/sent",
  protect,
  authorizeRoles("student"),
  getSentRequests
);

// Alumni accepts or rejects a request
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("alumni"),
  updateRequestStatus
);

// Student sends a mentorship request
router.post(
  "/",
  protect,
  authorizeRoles("student"),
  sendMentorshipRequest
);

export default router;