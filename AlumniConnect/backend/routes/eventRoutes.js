import express from "express";

import {
  createEvent,
  getAllEvents,
  getEventById,
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

/*
================================================
GET ALL EVENTS
Route: GET /api/events
Access: Logged-in users
================================================
*/

router.get(
  "/",
  protect,
  getAllEvents
);

/*
================================================
GET MY REGISTERED EVENTS
Route: GET /api/events/my-events
Access: Student
================================================
*/

router.get(
  "/my-events",
  protect,
  authorizeRoles("student"),
  getMyRegisteredEvents
);

/*
================================================
CREATE EVENT
Route: POST /api/events
Access: Alumni
================================================
*/

router.post(
  "/",
  protect,
  authorizeRoles("alumni"),
  createEvent
);

/*
================================================
REGISTER FOR EVENT
Route: POST /api/events/:id/register
Access: Student
================================================
*/

router.post(
  "/:id/register",
  protect,
  authorizeRoles("student"),
  registerForEvent
);

/*
================================================
CANCEL EVENT REGISTRATION
Route: DELETE /api/events/:id/register
Access: Student
================================================
*/

router.delete(
  "/:id/register",
  protect,
  authorizeRoles("student"),
  cancelRegistration
);

/*
================================================
GET REGISTERED USERS
Route: GET /api/events/:id/registered-users
Access: Alumni
================================================
*/

router.get(
  "/:id/registered-users",
  protect,
  authorizeRoles("alumni"),
  getRegisteredUsers
);

/*
================================================
GET ONE EVENT BY ID
Route: GET /api/events/:id
Access: Logged-in users
================================================
*/

router.get(
  "/:id",
  protect,
  getEventById
);

/*
================================================
UPDATE EVENT
Route: PATCH /api/events/:id
Access: Alumni
================================================
*/

router.patch(
  "/:id",
  protect,
  authorizeRoles("alumni"),
  updateEvent
);

/*
================================================
DELETE EVENT
Route: DELETE /api/events/:id
Access: Alumni
================================================
*/

router.delete(
  "/:id",
  protect,
  authorizeRoles("alumni"),
  deleteEvent
);

export default router;