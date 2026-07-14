// Handles routes that do not exist
export const notFound = (
  req,
  res,
  next
) => {
  const error = new Error(
    `Route not found: ${req.originalUrl}`
  );

  res.status(404);

  next(error);
};

// Handles errors from the application
export const errorHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode =
    res.statusCode === 200
      ? 500
      : res.statusCode;

  let message =
    err.message ||
    "Internal server error";

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  // Duplicate MongoDB value
  if (
    err.code === 11000
  ) {
    statusCode = 400;

    const duplicateField =
      Object.keys(
        err.keyValue || {}
      )[0];

    message = duplicateField
      ? `${duplicateField} already exists`
      : "Duplicate value already exists";
  }

  // Mongoose validation error
  if (
    err.name === "ValidationError"
  ) {
    statusCode = 400;

    message = Object.values(
      err.errors
    )
      .map(
        (error) =>
          error.message
      )
      .join(", ");
  }

  // Invalid JWT
  if (
    err.name === "JsonWebTokenError"
  ) {
    statusCode = 401;
    message = "Invalid JWT token";
  }

  // Expired JWT
  if (
    err.name === "TokenExpiredError"
  ) {
    statusCode = 401;
    message =
      "JWT token has expired. Please log in again";
  }

  console.error(
    `${req.method} ${req.originalUrl}: ${message}`
  );

  return res
    .status(statusCode)
    .json({
      success: false,
      message,
      ...(process.env.NODE_ENV ===
        "development" && {
        stack: err.stack,
      }),
    });
};