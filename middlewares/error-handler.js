// Centralized error handler
function errorHandler(err, req, res, next) {
  // Log the error stack (better than just err for debugging)
  console.error(err.stack || err);

  // Ensure statusCode is a valid integer
  let statusCode = 500;
  if (err.statusCode && Number.isInteger(err.statusCode)) {
    statusCode = err.statusCode;
  }

  // Use a safe message
  const message = statusCode === 500 ? "Internal Server Error" : err.message;

  // Send JSON response
  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
