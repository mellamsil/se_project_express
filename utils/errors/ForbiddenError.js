class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403; // FORBIDDEN
  }
}

module.exports = ForbiddenError;
