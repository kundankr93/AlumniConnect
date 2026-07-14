import Event from "../models/Event.js";

// Create an event
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      eventDate,
      location,
      mode,
      meetingLink,
    } = req.body || {};

    if (
      !title ||
      !description ||
      !eventDate ||
      !location ||
      !mode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, event date, location, and mode are required",
      });
    }

    const eventMode = mode.toLowerCase();

    if (
      !["online", "offline"].includes(
        eventMode
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Event mode must be online or offline",
      });
    }

    const parsedDate = new Date(eventDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid event date",
      });
    }

    if (parsedDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message:
          "Event date must be in the future",
      });
    }

    if (
      eventMode === "online" &&
      !meetingLink?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Meeting link is required for an online event",
      });
    }

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      eventDate: parsedDate,
      location: location.trim(),
      mode: eventMode,
      meetingLink:
        meetingLink?.trim() || "",
      createdBy: req.user._id,
    });

    await event.populate(
      "createdBy",
      "name email role profileImage"
    );

    return res.status(201).json({
      success: true,
      message:
        "Event created successfully",
      event,
    });
  } catch (error) {
    console.error(
      `Create event error: ${error.message}`
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating event",
    });
  }
};

// Get all upcoming events
export const getAllEvents = async (
  req,
  res
) => {
  try {
    const events = await Event.find({
      eventDate: {
        $gte: new Date(),
      },
    })
      .populate(
        "createdBy",
        "name email role profileImage"
      )
      .sort({
        eventDate: 1,
      });

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error(
      `Get all events error: ${error.message}`
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching events",
    });
  }
};

// Student registers for an event
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

    if (event.eventDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message:
          "Registration is closed because this event has already passed",
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
        "Registered for event successfully",
      eventId: event._id,
      registeredUsersCount:
        event.registeredUsers.length,
    });
  } catch (error) {
    console.error(
      `Register event error: ${error.message}`
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while registering for event",
    });
  }
};

// View events registered by logged-in student
export const getMyRegisteredEvents =
  async (req, res) => {
    try {
      const events = await Event.find({
        registeredUsers: req.user._id,
      })
        .populate(
          "createdBy",
          "name email role profileImage"
        )
        .sort({
          eventDate: 1,
        });

      return res.status(200).json({
        success: true,
        count: events.length,
        events,
      });
    } catch (error) {
      console.error(
        `Get registered events error: ${error.message}`
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while fetching registered events",
      });
    }
  };

// Cancel event registration
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
      registeredUsersCount:
        event.registeredUsers.length,
    });
  } catch (error) {
    console.error(
      `Cancel registration error: ${error.message}`
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while cancelling registration",
    });
  }
};

// Event creator views registered students
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
          "Only the event creator can view registered users",
      });
    }

    return res.status(200).json({
      success: true,
      count:
        event.registeredUsers.length,
      registeredUsers:
        event.registeredUsers,
    });
  } catch (error) {
    console.error(
      `Get registered users error: ${error.message}`
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching registered users",
    });
  }
};

// Event creator updates event
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
          "You can update only your own event",
      });
    }

    const {
      title,
      description,
      eventDate,
      location,
      mode,
      meetingLink,
    } = req.body || {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Event title cannot be empty",
        });
      }

      event.title = title.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Event description cannot be empty",
        });
      }

      event.description =
        description.trim();
    }

    if (eventDate !== undefined) {
      const parsedDate =
        new Date(eventDate);

      if (
        Number.isNaN(
          parsedDate.getTime()
        ) ||
        parsedDate <= new Date()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Event date must be a valid future date",
        });
      }

      event.eventDate = parsedDate;
    }

    if (location !== undefined) {
      if (!location.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Event location cannot be empty",
        });
      }

      event.location =
        location.trim();
    }

    if (mode !== undefined) {
      const eventMode =
        mode.toLowerCase();

      if (
        !["online", "offline"].includes(
          eventMode
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Event mode must be online or offline",
        });
      }

      event.mode = eventMode;
    }

    if (meetingLink !== undefined) {
      event.meetingLink =
        meetingLink.trim();
    }

    if (
      event.mode === "online" &&
      !event.meetingLink
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Meeting link is required for an online event",
      });
    }

    if (event.mode === "offline") {
      event.meetingLink = "";
    }

    await event.save();

    await event.populate(
      "createdBy",
      "name email role profileImage"
    );

    return res.status(200).json({
      success: true,
      message:
        "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error(
      `Update event error: ${error.message}`
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating event",
    });
  }
};

// Event creator deletes event
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
          "You can delete only your own event",
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
      `Delete event error: ${error.message}`
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while deleting event",
    });
  }
};