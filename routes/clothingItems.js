const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  disLikeItem,
  likeItem,
} = require("../controllers/clothingItems");

// CRUD

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Delete an item
router.delete("/:itemId", auth, deleteItem);

// Like an item
router.put("/:itemId/likes", auth, likeItem);

// Dislike (unlike) an item
router.delete("/:itemId/likes", auth, disLikeItem);

module.exports = router;
