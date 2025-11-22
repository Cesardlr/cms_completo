const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Database errors
  if (err.code === "23505") {
    return res.status(409).json({
      error: "Duplicate entry",
      detail: err.detail,
    });
  }

  if (err.code === "23503") {
    return res.status(400).json({
      error: "Foreign key constraint violation",
      detail: err.detail,
    });
  }

  if (err.code === "23502") {
    return res.status(400).json({
      error: "Required field missing",
      detail: err.detail,
    });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation error",
      details: err.errors,
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
