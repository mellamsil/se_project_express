const router = require("express").Router();
const usersController = require("../controllers/users");
const { getCurrentUser, updateProfile } = require("../controllers/users");
console.log(updateProfile);

const auth = require("../middleware/auth");

// const express = require("express");

router.patch("/me", auth, usersController.updateUserProfile);

router.get("/me", auth, getCurrentUser);
// router.patch("/me", auth, updateProfile);

module.exports = router;
