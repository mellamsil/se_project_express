const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

// Get current user
const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  return User.findById(_id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid user ID" });
      }
      return res.status(500).send({ message: "Internal server error" });
    });
};

// Create a new user (signup)
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }
  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(409)
          .send({ message: "User with this email already exists" });
      }

      // Hash password and create new user
      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then((user) => {
          const userObj = user.toObject();
          delete userObj.password;
          return res.status(201).send(userObj);
        });
    })

    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid data" });
      }
      console.error(err);
      return res.status(500).send({ message: "Internal server error" });
    });
};

const findUser = (req, res) => {
  const { email, password, name, avatar } = req.body;

  if (!email || !password || !name || !avatar) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(400)
          .send({ message: "User with this email already exists" });
      }

      // Hash the password
      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then((newUser) =>
          res.status(201).send({
            _id: newUser._id,
            name: newUser.name,
            avatar: newUser.avatar,
            email: newUser.email,
          })
        );
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(409)
          .send({ message: "User with this email already exists" });
      }
      console.error(err);
      return res.status(500).send({ message: "Internal server error" });
    });
};

// User login
const login = (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  // Find the user by credentials
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user._id || !JWT_SECRET) {
        return res
          .status(500)
          .send({ message: "Internal server error during token generation" });
      }

      // Create a unique token associated with the user who has logged in
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send token to client
      return res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res.status(401).send({ message: "Invalid email or password" });
      }
      console.error(err);
      return res
        .status(500)
        .send({ message: "Internal server error during login" });
    });
};

// Update user profile (name and avatar)
const updateUserProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.status(200).json(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Invalid data", error: err.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    });
};

module.exports = {
  createUser,
  findUser,
  getCurrentUser,
  login,
  updateUserProfile,
};
