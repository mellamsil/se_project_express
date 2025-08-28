const { Joi, celebrate, Segments } = require("celebrate");
const validator = require("validator");

// URL validator
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// MongoDB ObjectId validator
const validateObjectId = (value, helpers) => {
  if (/^[0-9a-fA-F]{24}$/.test(value)) {
    return value;
  }
  return helpers.message("Invalid ID format");
};

// 1. Clothing item creation
const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

// 2. User creation
const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 3. User login
const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// 4. ID validation for users or items
const validateIdParam = celebrate({
  PARAMS: Joi.object().keys({
    id: Joi.string().required().custom(validateObjectId).messages({
      "string.empty": 'The "id" parameter must be filled in',
      "any.custom":
        'The "id" parameter must be a valid 24-character hexadecimal',
    }),
  }),
});

// 5. Query validation (optional, for pagination)
const validateQuery = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().integer().min(1).messages({
      "number.base": 'The "page" query must be a number',
      "number.min": 'The "page" query must be at least 1',
    }),
    limit: Joi.number().integer().min(1).max(100).messages({
      "number.base": 'The "limit" query must be a number',
      "number.min": 'The "limit" query must be at least 1',
      "number.max": 'The "limit" query cannot exceed 100',
    }),
  }),
});

// 6. Auth header validation
const validateAuthHeader = celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required().messages({
      "string.empty": "Authorization header is required",
    }),
  }).unknown(), // allow other headers
});

module.exports = {
  createItemValidation,
  createUserValidation,
  loginValidation,
  idValidation,
  validateCardBody,
  validateUserBody,
  validateLogin,
  validateIdParam,
  validateAuthHeader,
};
