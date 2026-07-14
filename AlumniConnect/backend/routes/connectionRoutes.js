import express from "express";

import {
  sendConnectionRequest,
  getReceivedRequests,
  respondToConnectionRequest,
  getMyConnections,
  removeConnection,
} from "../controllers/connectionController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// View accepted connections
router.get(
  "/",
  protect,
  getMyConnections
);

// Send connection request
router.post(
  "/",
  protect,
  sendConnectionRequest
);

// View pending requests received
router.get(
  "/received",
  protect,
  getReceivedRequests
);

// Accept or reject a connection request
router.patch(
  "/:id/respond",
  protect,
  respondToConnectionRequest
);

// Remove an accepted connection
router.delete(
  "/:id",
  protect,
  removeConnection
);

export default router;