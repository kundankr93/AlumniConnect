import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["student", "alumni"],
      required: true,
    },

    college: {
      type: String,
      default: "NIT Raipur",
      trim: true,
    },

    branch: {
      type: String,
      trim: true,
      default: "",
    },

    graduationYear: {
      type: Number,
    },

    company: {
      type: String,
      trim: true,
      default: "",
    },

    jobTitle: {
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

    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;