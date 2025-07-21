const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");
const { NOT_FOUND } = require("../utils/errors");

router.post("/signin", auth, login);
router.post("/signup", auth, createUser);
router.use("/items", auth, clothingItem);
router.use("/users", auth, userRouter);
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
