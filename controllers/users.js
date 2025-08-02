const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  return User.findById(_id)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res.status(BAD_REQUEST).send({ message: "All fields are required" });
  }
  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(CONFLICT)
          .send({ message: "User with this email already exists" });
      }

      // Hash password and create new user
      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then((user) => {
          const userObj = user.toObject();
          delete userObj.password;
          return res.status(CREATED).send(userObj);
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data or invalid ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const findUser = (req, res) => {
  const { email, password, name, avatar } = req.body;

  if (!email || !password || !name || !avatar) {
    return res.status(BAD_REQUEST).send({ message: "Missing required fields" });
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(BAD_REQUEST)
          .send({ message: "User with this email already exists" });
      }

      // Hash the password
      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then((newUser) =>
          res.status(CREATED).send({
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
          .status(CONFLICT)
          .send({ message: "User with this email already exists" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  // Find the user by credentials
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user._id || !JWT_SECRET) {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "Internal server error during token generation" });
      }

      // Create a unique token associated with the user who has logged in
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        //1j98jf812f81j2f812jf81j2f81j2f81jf2891jf81jf981j2f891jf812
        expiresIn: "7d",
      });

      // Send token to client
      return res.status(OK).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Invalid email or password" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal server error during login" });
    });
};

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
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(OK).json(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid data", error: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    });
};

module.exports = {
  createUser,
  findUser,
  getCurrentUser,
  login,
  updateUserProfile,
};
