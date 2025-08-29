class CreatedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 201; // CREATED
  }
}

module.exports = CreatedError;
