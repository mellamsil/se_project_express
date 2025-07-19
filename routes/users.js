const router = require("express").Router();
const usersController = require("../controllers/users");
const { getCurrentUser } = require("../controllers/users");

const auth = require("../middleware/auth");

router.patch("/me", auth, usersController.updateUserProfile);

router.get("/me", auth, getCurrentUser);

module.exports = router;
