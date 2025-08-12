const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const { NOT_FOUND } = require("../utils/errors");

router.post("/signin", login);
router.post("/signup", createUser);
// router.post("/signup", (req, res) => {
//   const { name, email, password } = req.body;
// });

router.use("/items", clothingItem);
router.use("/users", userRouter);

// 404 fallback
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
