import MentorshipRequest from "../models/MentorshipRequest.js";
import User from "../models/User.js";

export const sendMentorshipRequest = async (
  req,
  res
) => {
  try {
    const { alumniId, message } = req.body;

    // Check required fields
    if (!alumniId || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Alumni ID and message are required",
      });
    }

    // Find the selected alumni
    const alumni = await User.findById(
      alumniId
    );

    // Check whether the user exists
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    // Check whether selected user is an alumni
    if (alumni.role !== "alumni") {
      return res.status(400).json({
        success: false,
        message:
          "Mentorship requests can only be sent to alumni",
      });
    }

    // Check for an existing request
    const existingRequest =
      await MentorshipRequest.findOne({
        student: req.user._id,
        alumni: alumniId,
      });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message:
          "You have already sent a mentorship request to this alumni",
      });
    }

    // Create mentorship request
    const mentorshipRequest =
      await MentorshipRequest.create({
        student: req.user._id,
        alumni: alumniId,
        message,
      });

    return res.status(201).json({
      success: true,
      message:
        "Mentorship request sent successfully",
      request: mentorshipRequest,
    });
  } catch (error) {
    console.error(
      `Send mentorship request error: ${error.message}`
    );

    // Invalid MongoDB ID
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid alumni ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while sending mentorship request",
    });
  }
};

export const getReceivedRequests = async (
  req,
  res
) => {
  try {
    const requests =
      await MentorshipRequest.find({
        alumni: req.user._id,
      })
        .populate(
          "student",
          "name email branch graduationYear profileImage"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error(
      `Get received requests error: ${error.message}`
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching received mentorship requests",
    });
  }
};

export const updateRequestStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    // Check whether status is valid
    if (
      !status ||
      !["accepted", "rejected"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be either accepted or rejected",
      });
    }

    // Find mentorship request
    const request =
      await MentorshipRequest.findById(
        req.params.id
      );

    // Check whether request exists
    if (!request) {
      return res.status(404).json({
        success: false,
        message:
          "Mentorship request not found",
      });
    }

    // Check whether this request belongs
    // to the logged-in alumni
    if (
      request.alumni.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to update this mentorship request",
      });
    }

    // Update request status
    request.status = status;

    await request.save();

    // Add student information to response
    await request.populate(
      "student",
      "name email branch graduationYear profileImage"
    );

    return res.status(200).json({
      success: true,
      message: `Mentorship request ${status} successfully`,
      request,
    });
  } catch (error) {
    console.error(
      `Update mentorship request error: ${error.message}`
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message:
          "Invalid mentorship request ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating mentorship request",
    });
  }
};

export const getSentRequests = async (
  req,
  res
) => {
  try {
    const requests =
      await MentorshipRequest.find({
        student: req.user._id,
      })
        .populate(
          "alumni",
          "name email profileImage"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error(
      `Get sent requests error: ${error.message}`
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching sent mentorship requests",
    });
  }
};