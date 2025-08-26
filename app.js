const express = require("express");
const { errors } = require("celebrate");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const mainRouter = require("./routes/index");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");

const { PORT = 3001 } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger); // Log all requests

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

// Routes
app.use("/", mainRouter);

app.use(errorLogger); // enabling the error logger

app.use(errors()); // celebrate error handler
app.use(errorHandler); //centralized error handler

// Start server
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
