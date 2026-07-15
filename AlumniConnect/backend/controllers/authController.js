import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      branch,
      graduationYear,
      company,
      jobTitle,
      skills,
    } = req.body;

    // Check required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password, and role are required",
      });
    }

    // Normalize email
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // Check whether the email already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists with this email",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Convert skills into an array
    let formattedSkills = [];

    if (Array.isArray(skills)) {
      formattedSkills = skills;
    } else if (typeof skills === "string") {
      formattedSkills = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");
    }

    // Create the new user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      branch: branch || "",
      graduationYear: graduationYear || null,
      company: company || "",
      jobTitle: jobTitle || "",
      skills: formattedSkills,
    });

    // Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        graduationYear: user.graduationYear,
        company: user.company,
        jobTitle: user.jobTitle,
        skills: user.skills,
        profileImage: user.profileImage || "",
      },
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while registering user",
    });
  }
};

// Login an existing user
export const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // Normalize email
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // Compare entered and stored passwords
    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        graduationYear: user.graduationYear,
        company: user.company,
        jobTitle: user.jobTitle,
        skills: user.skills,
        profileImage: user.profileImage || "",
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while logging in",
    });
  }
};

// Get the logged-in user's profile
export const getMyProfile = async (
  req,
  res
) => {
  try {
    // Supports both req.user._id and req.user.id
    const userId =
      req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User ID was not found. Please log in again.",
      });
    }

    // Find the user and remove the password
    const user = await User.findById(
      userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Get profile error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching profile",
    });
  }
};
// Update logged-in user's profile
export const updateMyProfile = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?._id ||
      req.user?.id;

    const user = await User.findById(
      userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      name,
      branch,
      graduationYear,
      company,
      jobTitle,
      skills,
    } = req.body;

    // Update only the provided fields
    if (name !== undefined) {
      user.name = name.trim();
    }

    if (branch !== undefined) {
      user.branch = branch.trim();
    }

    if (
      graduationYear !== undefined
    ) {
      user.graduationYear =
        graduationYear || null;
    }

    if (company !== undefined) {
      user.company =
        company.trim();
    }

    if (jobTitle !== undefined) {
      user.jobTitle =
        jobTitle.trim();
    }

    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        user.skills = skills
          .map((skill) =>
            skill.trim()
          )
          .filter(
            (skill) =>
              skill !== ""
          );
      } else if (
        typeof skills ===
        "string"
      ) {
        user.skills = skills
          .split(",")
          .map((skill) =>
            skill.trim()
          )
          .filter(
            (skill) =>
              skill !== ""
          );
      }
    }

    const updatedUser =
      await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",

      user: {
        _id:
          updatedUser._id,

        name:
          updatedUser.name,

        email:
          updatedUser.email,

        role:
          updatedUser.role,

        branch:
          updatedUser.branch,

        graduationYear:
          updatedUser
            .graduationYear,

        company:
          updatedUser.company,

        jobTitle:
          updatedUser.jobTitle,

        skills:
          updatedUser.skills,

        profileImage:
          updatedUser
            .profileImage ||
          "",
      },
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating profile",
    });
  }
};