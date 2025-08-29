class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400; // BAD_REQUEST
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401; // UNAUTHORIZED
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404; // NOT_FOUND
  }
}

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500; // INTERNAL_SERVER_ERROR
  }
}

class OkError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 200; // OK
  }
}

class CreatedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 201; // CREATED
  }
}

class NoContentError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 204;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403; // FORBIDDEN
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409; // CONFLICT
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
  OkError,
  CreatedError,
  NoContentError,
  ForbiddenError,
  ConflictError,
};
