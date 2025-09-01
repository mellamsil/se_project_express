const router = require("express").Router();
const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");

const { validateLogin, validateUserBody } = require("../middleware/validation");
const { NotFoundError } = require("../utils/errors"); // <-- import error class

// Public routes
router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);

// Item routes (requires authentication in clothingItems router)
router.use("/items", clothingItemRouter);

// User routes
router.use("/users", userRouter);

router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Catch-all for unknown routes
router.use((req, res, next) => {
  next(new NotFoundError("Route not found")); // <-- pass error to central handler
});

module.exports = router;
