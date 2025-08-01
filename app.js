const express = require("express");

const app = express();
// const itemsRouter = require("./routes/items");
const mongoose = require("mongoose");
const cors = require("cors");

// const userRoutes = require('./routes/users');
// const itemRoutes = require('./routes/items');
// const authMiddleware = require('./middleware/auth');

const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

app.use("/", mainRouter);
// app.use("/items", itemsRouter);

// app.use("/signup", userRoutes);
// app.use("/signin", userRoutes);
// app.use("/users", authMiddleware, userRoutes);
// app.use("/items", itemRoutes);
// app.use("*", (req, res) => {
//   res.status(404).send("Not found");
// });

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});

module.exports = app;
