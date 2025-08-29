class NoContentError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 204; // NO_CONTENT
  }
}

module.exports = NoContentError;
