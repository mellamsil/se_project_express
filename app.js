const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const cors = require("cors");
const { login, createUser } = require("./controllers/users");
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());
app.post("/signin", login);
app.post("/signup", createUser);
// app.use(routes);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch(console.error);

const routes = require("./routes");
const { INTERNAL_SERVER_ERROR } = require("./utils/errors");

// app.use((req, res, next) => {
//   req.user = {
//     _id: "68691e1bf540739bd0fae45d",
//   };
//   next();
// });

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});

// module.exports = (error, req, res) => {
//   console.error(error);
//   error.statusCode = error.statusCode || 500;
//   error.statusCode = error.status || "error";
//   res.status(error.statusCode).json({
//     STATUS: error.statusCode,
//     message: error.message,
//   });
// };

module.exports = (error, req, res) => {
  console.error(error);

  const statusCode = error.statusCode || error.status || INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    STATUS: statusCode,
    message: error.message || "Internal Server Error",
  });
};
