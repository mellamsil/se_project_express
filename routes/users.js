const router = require("express").Router();
const { updateUserProfile, getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const { validateUserBody } = require("../middleware/validation");

// Update current user (PATCH /users/me)
router.patch("/me", auth, validateUserBody, updateUserProfile);

// Get current user (GET /users/me)
router.get("/me", auth, getCurrentUser);

module.exports = router;
