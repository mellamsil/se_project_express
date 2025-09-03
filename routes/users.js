const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const { updateUserProfile, getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

// Joi validation schema for updating profile
const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().required(), // ensures it's a valid URL
  }),
});

// Update current user (PATCH /users/me)
router.patch("/me", auth, validateUpdateProfile, updateUserProfile);

// Get current user (GET /users/me)
router.get("/me", auth, getCurrentUser);

module.exports = router;
