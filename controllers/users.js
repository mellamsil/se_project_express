const user = require("../models/user");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

// const bcrypt = require("bcryptjs");
const {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
} = require("../utils/errors");
const jwt = require("jsonwebtoken");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
      console.error(err);

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  const { id } = req.user;
  User.findById(id)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) =>
      res.status(CREATED).send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      })
    )
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

// const createUser = (req, res) => {
//   const { name, avatar } = req.body;
//   User.create({ name, avatar })
//     .then((user) => res.status(CREATED).send(user))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "ValidationError") {
//         return res.status(BAD_REQUEST).send({ message: "Invalid data" });
//       }
//       return res
//         .status(INTERNAL_SERVER_ERROR)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// const email = req.body.email;

const getUser = (req, res) => {
  const { email, password } = req.body.email;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res
          .status(400)
          .send({ message: "User with this email already exists" });
      }

      // Hash the password
      return bcrypt
        .hash(password, 10)
        .then((hash) => {
          return user.create({ name, avatar, email, password: hash });
        })
        .then((newUser) => {
          res.status(201).send({ data: newUser });
        });
    })
    .catch((err) => {
      console.error("createUser error name:");
      if (err.code === 11000) {
        return res
          .status(409)
          .send({ message: "User with this email already exists" });
      }
      return res
        .status(500)
        .send({ message: "An error has occurred on the server." });
    });
};

// User.findOne({ email })
//   .then((user) => {
//     if (user) {
//       return res
//         .status(400)
//         .send({ message: "User with this email already exists" });
//     }

//     // Hash the password
//     return bcrypt
//       .hash(password, 10)
//       .then((hash) => {
//         return user.create({ name, avatar, email, password: hash });
//       })
//       .then((newUser) => {
//         res.status(201).send({ data: newUser });
//       });
//   })
//   .catch((err) => {
//     console.error("createUser error name:");
//     if (err.code === 11000) {
//       return res
//         .status(409)
//         .send({ message: "User with this email already exists" });
//     }
//     return res
//       .status(500)
//       .send({ message: "An error has occurred on the server." });
//   });

const login = (req, res) => {
  const { email, password } = req.body;

  // Find the user by credentials
  User.findUserByCredentials(email, password)
    .then((user) => {
      console.log("user object from the login controller", user);
      if (!user) {
        return res.status(401).send({ message: "Invalid email or password " });
      }

      //Check if user ID or JWT_SECRET is undefined
      if (!user._id || !JWT_SECRET) {
        console.error("user._id or JWT_SECRET is undefined");
        return res
          .status(500)
          .send({ message: "Internal server error from the try statement" });
      }

      // Generate JWT
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      //Send token to client
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error("Login error:", err.name);
      res.status(500).send({
        message:
          "Internal server error from the catch in the login controller" + err,
      });
    });

  //Compare the password
};

const updateUserProfile = function (req, res) {
  const userId = req.user._id; // assumes auth middleware sets req.user
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true, // return the updated document
      runValidators: true, // run schema validators
    }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Invalid data", error: err.message });
      }
      res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  getCurrentUser,
  login,
  updateUserProfile,
};
