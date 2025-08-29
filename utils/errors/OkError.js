class OkError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 200; // OK
  }
}

module.exports = OkError;
