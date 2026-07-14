import mongoose from "mongoose";

const alumniProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
    },

    graduationYear: {
      type: Number,
      required: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    location: {
      type: String,
      trim: true,
      default: "",
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    availableForMentorship: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const AlumniProfile = mongoose.model(
  "AlumniProfile",
  alumniProfileSchema
);

export default AlumniProfile;