import mongoose from "mongoose";

const mentorshipRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

mentorshipRequestSchema.index(
  {
    student: 1,
    alumni: 1,
  },
  {
    unique: true,
  }
);

const MentorshipRequest = mongoose.model(
  "MentorshipRequest",
  mentorshipRequestSchema
);

export default MentorshipRequest;