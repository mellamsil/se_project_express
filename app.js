const express = require("express");
const { errors } = require("celebrate");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const mainRouter = require("./routes/index");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");
const { NotFoundError } = require("./utils/errors");

const { PORT = 3001 } = process.env;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger); // Log all requests

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.use("/", mainRouter);

// 404 handler (must come after all routes)
app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

// Error logging middleware
app.use(errorLogger); // Log errors

app.use(errors()); // Celebrate validation errors
app.use(errorHandler); // Centralized error handler

// Start server
app.listen(PORT, () => console.log(`App listening at port ${PORT}`));

module.exports = app;
