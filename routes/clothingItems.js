const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  disLikeItem,
  LikeItem,
} = require("../controllers/clothingItems");

// CRUD

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", deleteItem);

// Like an item by ID
router.put("/:itemId/Likes", LikeItem);

// DisLike an item by ID
router.delete("/:itemId/likes", disLikeItem);

module.exports = router;
