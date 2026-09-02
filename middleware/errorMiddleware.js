function errorMiddleware(err, req, res, next) {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      message: err.message,
      error: err.message,
      stack: err.stack,
    });
  }

  if (err.isOperational) {
    return res.status(statusCode).json({
      message: err.message,
    });
  }

  return res.status(statusCode).json({
    message: "Internal Server error",
  });
}

module.exports = errorMiddleware;