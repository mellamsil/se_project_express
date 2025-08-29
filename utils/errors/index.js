const BadRequestError = require("./BadRequestError");
const UnauthorizedError = require("./UnauthorizedError");
const NotFoundError = require("./NotFoundError");
const InternalServerError = require("./InternalServerError");
const OkError = require("./OkError");
const CreatedError = require("./CreatedError");
const NoContentError = require("./NoContentError");
const ForbiddenError = require("./ForbiddenError");
const ConflictError = require("./ConflictError");

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
