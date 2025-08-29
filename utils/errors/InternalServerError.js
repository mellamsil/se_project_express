class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500; // INTERNAL_SERVER_ERROR
  }
}

module.exports = InternalServerError;
