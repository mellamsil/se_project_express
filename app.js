const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB"), (e) => console.log("DB error", e);
  })
  .catch(console.error);

const routes = require("./routes");
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "68691e1bf540739bd0fae45d",
  };
  next();
});
app.use(routes);
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
  console.log("This is working");
});

module.exports = (error, req, res, next) => {
  console.log("MIDDLEWARE");
  console.error(err);
  error.statusCode = error.statusCode || 500;
  error.statusCode = error.status || "error";
  res.status(error.statusCode).json({
    STATUS: error.statusCode,
    message: error.message,
  });
};
