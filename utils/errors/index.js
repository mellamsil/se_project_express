const BadRequestError = require("./BadRequestError");
const UnauthorizedError = require("./UnauthorizedError");
const NotFoundError = require("./NotFoundError");
const InternalServerError = require("./InternalServerError");
const ForbiddenError = require("./ForbiddenError");
const ConflictError = require("./ConflictError");

module.exports = {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
  ForbiddenError,
  ConflictError,
};
