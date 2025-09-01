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
  return undefined;
});

// Crash-test route
router.get("/crash-test", (req, res) => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
  // Return a response immediately to satisfy consistent-return
  return res.send("Server will crash shortly");
});

// Catch-all for unknown routes
router.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log("Request to unknown route");

  const forbiddenPaths = [
    ".env",
    ".env.save",
    ".env.prod",
    "phpinfo.php",
    "php_info.php",
    "_profiler/phpinfo",
  ];

  // Block requests to sensitive files
  if (forbiddenPaths.some((path) => req.path.includes(path))) {
    return res.status(403).json({ message: "Access denied" });
  }

  // eslint-disable-next-line no-console
  console.warn(`Unknown route requested: ${req.method} ${req.originalUrl}`);

  // Forward a 404 error to central error handler
  return next(new NotFoundError("Route not found"));
});

module.exports = router;
