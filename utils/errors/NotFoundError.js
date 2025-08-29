class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404; // NOT_FOUND
  }
}

module.exports = NotFoundError;
