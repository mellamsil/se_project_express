const router = require("express").Router();
const clothingItemRouter = require("./clothingItems");
const clothingItem = require("./clothingItems");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const { NOT_FOUND } = require("../utils/errors");

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);

// Item routes (requires authentication in clothingItems router)
router.use("/items", clothingItem);
router.use("/items", clothingItemRouter);

// User routes
router.use("/users", userRouter);

// Catch-all for unknown routes
router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
