class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400; // BAD_REQUEST
  }
}

module.exports = BadRequestError;
