import express from "express";

import {
  createEvent,
  getAllEvents,
  registerForEvent,
  getMyRegisteredEvents,
  cancelRegistration,
  getRegisteredUsers,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// View all upcoming events
router.get(
  "/",
  protect,
  getAllEvents
);

// Student views registered events
router.get(
  "/my-events",
  protect,
  authorizeRoles("student"),
  getMyRegisteredEvents
);

// Alumni creates an event
router.post(
  "/",
  protect,
  authorizeRoles("alumni"),
  createEvent
);

// Student registers for an event
router.post(
  "/:id/register",
  protect,
  authorizeRoles("student"),
  registerForEvent
);

// Student cancels event registration
router.delete(
  "/:id/register",
  protect,
  authorizeRoles("student"),
  cancelRegistration
);

// Event creator views registered students
router.get(
  "/:id/registered-users",
  protect,
  authorizeRoles("alumni"),
  getRegisteredUsers
);

// Event creator updates an event
router.patch(
  "/:id",
  protect,
  authorizeRoles("alumni"),
  updateEvent
);

// Event creator deletes an event
router.delete(
  "/:id",
  protect,
  authorizeRoles("alumni"),
  deleteEvent
);

export default router;