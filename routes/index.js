const router = require("express").Router();
const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");

const { validateLogin, validateUserBody } = require("../middleware/validation");

// Public routes
router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);

// Item routes (requires authentication in clothingItems router)
router.use("/items", clothingItemRouter);

// User routes
router.use("/users", userRouter);

// Catch-all for unknown routes
router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
