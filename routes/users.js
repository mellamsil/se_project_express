const router = require("express").Router();
// you get updateProfile from users, but there is no such a function
const usersController = require("../controllers/users");
const { getCurrentUser, updateProfile } = require("../controllers/users");
console.log(updateProfile);

const auth = require("../middleware/auth");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);

const express = require("express");

router.patch("/me", auth, usersController.updateUserProfile);

router.get("/me", auth, getCurrentUser);
// router.patch("/me", auth, updateProfile);

module.exports = router;
