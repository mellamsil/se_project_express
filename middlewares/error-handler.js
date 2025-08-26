// Centralized error handler
function errorHandler(err, req, res, next) {
  // Log the error
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Server Error";

  // Send JSON response
  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
