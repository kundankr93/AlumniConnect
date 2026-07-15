import jwt from "jsonwebtoken";

import User from "../models/User.js";

// Verify JWT token
export const protect = async (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required. Please log in.",
      });
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token was not found.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user =
      await User.findById(
        decoded.id
      ).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "The user associated with this token was not found.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Your login session has expired. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message:
        "Invalid authentication token. Please log in again.",
    });
  }
};

// Allow only selected user roles
export const authorizeRoles = (
  ...allowedRoles
) => {
  return (
    req,
    res,
    next
  ) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication is required.",
      });
    }

    if (
      !allowedRoles.includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          `Access denied. This route is only available to: ${allowedRoles.join(
            ", "
          )}`,
      });
    }

    next();
  };
};