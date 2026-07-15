import Event from "../models/Event.js";

/*
================================================
CREATE EVENT
POST /api/events
Access: Alumni
================================================
*/

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      eventType,
      meetingLink,
    } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, and event date are required",
      });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      eventType,
      meetingLink,
      createdBy: req.user._id,
    });

    const populatedEvent = await Event.findById(
      event._id
    ).populate(
      "createdBy",
      "name email role profileImage"
    );

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: populatedEvent,
    });
  } catch (error) {
    console.error(
      "Create event error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};

/*
================================================
GET ALL EVENTS
GET /api/events
Access: Logged-in users
================================================
*/

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate(
        "createdBy",
        "name email role profileImage"
      )
      .sort({
        date: 1,
      });

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error(
      "Get all events error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

/*
================================================
GET ONE EVENT BY ID
GET /api/events/:id
Access: Logged-in users
================================================
*/

export const getEventById = async (
  req,
  res
) => {
  try {
    const event = await Event.findById(
      req.params.id
    )
      .populate(
        "createdBy",
        "name email role profileImage"
      )
      .populate(
        "registeredUsers",
        "name email role profileImage"
      );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error(
      "Get event by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
};

/*
================================================
REGISTER FOR EVENT
POST /api/events/:id/register
Access: Student
================================================
*/

export const registerForEvent = async (
  req,
  res
) => {
  try {
    const event = await Event.findById(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const alreadyRegistered =
      event.registeredUsers.some(
        (userId) =>
          userId.toString() ===
          req.user._id.toString()
      );

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message:
          "You are already registered for this event",
      });
    }

    event.registeredUsers.push(
      req.user._id
    );

    await event.save();

    return res.status(200).json({
      success: true,
      message:
        "Registered for the event successfully",
      event,
    });
  } catch (error) {
    console.error(
      "Register event error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to register for the event",
      error: error.message,
    });
  }
};

/*
================================================
GET MY REGISTERED EVENTS
GET /api/events/my-events
Access: Student
================================================
*/

export const getMyRegisteredEvents = async (
  req,
  res
) => {
  try {
    const events = await Event.find({
      registeredUsers: req.user._id,
    })
      .populate(
        "createdBy",
        "name email role profileImage"
      )
      .sort({
        date: 1,
      });

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error(
      "Get registered events error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch registered events",
      error: error.message,
    });
  }
};

/*
================================================
CANCEL EVENT REGISTRATION
DELETE /api/events/:id/register
Access: Student
================================================
*/

export const cancelRegistration = async (
  req,
  res
) => {
  try {
    const event = await Event.findById(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const isRegistered =
      event.registeredUsers.some(
        (userId) =>
          userId.toString() ===
          req.user._id.toString()
      );

    if (!isRegistered) {
      return res.status(400).json({
        success: false,
        message:
          "You are not registered for this event",
      });
    }

    event.registeredUsers =
      event.registeredUsers.filter(
        (userId) =>
          userId.toString() !==
          req.user._id.toString()
      );

    await event.save();

    return res.status(200).json({
      success: true,
      message:
        "Event registration cancelled successfully",
    });
  } catch (error) {
    console.error(
      "Cancel registration error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to cancel event registration",
      error: error.message,
    });
  }
};

/*
================================================
GET REGISTERED USERS
GET /api/events/:id/registered-users
Access: Event creator
================================================
*/

export const getRegisteredUsers = async (
  req,
  res
) => {
  try {
    const event = await Event.findById(
      req.params.id
    ).populate(
      "registeredUsers",
      "name email role branch graduationYear profileImage"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (
      event.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only view registrations for your own events",
      });
    }

    return res.status(200).json({
      success: true,
      count:
        event.registeredUsers.length,
      users: event.registeredUsers,
    });
  } catch (error) {
    console.error(
      "Get registered users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch registered users",
      error: error.message,
    });
  }
};

/*
================================================
UPDATE EVENT
PATCH /api/events/:id
Access: Event creator
================================================
*/

export const updateEvent = async (
  req,
  res
) => {
  try {
    const event = await Event.findById(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (
      event.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only update your own events",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "date",
      "location",
      "eventType",
      "meetingLink",
    ];

    allowedFields.forEach((field) => {
      if (
        req.body[field] !== undefined
      ) {
        event[field] =
          req.body[field];
      }
    });

    await event.save();

    const updatedEvent =
      await Event.findById(
        event._id
      ).populate(
        "createdBy",
        "name email role profileImage"
      );

    return res.status(200).json({
      success: true,
      message:
        "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error(
      "Update event error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update event",
      error: error.message,
    });
  }
};

/*
================================================
DELETE EVENT
DELETE /api/events/:id
Access: Event creator
================================================
*/

export const deleteEvent = async (
  req,
  res
) => {
  try {
    const event = await Event.findById(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (
      event.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only delete your own events",
      });
    }

    await event.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Event deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete event error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete event",
      error: error.message,
    });
  }
};