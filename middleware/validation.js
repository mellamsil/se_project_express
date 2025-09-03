const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// URL validator
const validateURL = (value, helpers) => {
  if (validator.isURL(value, { require_protocol: true, require_tld: false })) {
    return value;
  }
  return helpers.error("string.uri");
};

// MongoDB ObjectId validator
const validateObjectId = (value, helpers) => {
  if (/^[0-9a-fA-F]{24}$/.test(value)) {
    return value;
  }
  return helpers.error("any.custom"); // consistent with Joi custom messages
};

// 1. Clothing item creation
const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "any.only": 'The "weather" field must be one of: hot, warm, cold',
      "string.empty": 'The "weather" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
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
    password: Joi.string().required().min(8).messages({
      "string.empty": 'The "password" field must be filled in',
      "string.min": 'The "password" must be at least 8 characters long',
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

// 4. Update profile (PATCH /users/me → name + avatar only)
const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.empty": 'The "name" field must be filled in',
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
  }),
});

// 5. ID validation for users or items
const validateIdParam = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().custom(validateObjectId).messages({
      "string.empty": 'The "itemId" parameter must be filled in',
      "any.custom":
        'The "itemId" parameter must be a valid 24-character hexadecimal',
    }),
  }),
});

// 6. Query validation (optional, for pagination)
const validateQuery = celebrate({
  query: Joi.object().keys({
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

// 7. Auth header validation
const validateAuthHeader = celebrate({
  headers: Joi.object({
    authorization: Joi.string().required().messages({
      "string.empty": "Authorization header is required",
    }),
  }).unknown(), // allow other headers
});

module.exports = {
  validateCardBody,
  validateUserBody,
  validateLogin,
  validateUpdateProfile,
  validateIdParam,
  validateQuery,
  validateAuthHeader,
};
