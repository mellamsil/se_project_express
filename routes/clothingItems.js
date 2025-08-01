const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  disLikeItem,
  likeItem,
} = require("../controllers/clothingItems");

// Public route to get all items
router.get("/", getItems);

// Apply authentication middleware to all routes below
router.use(auth);

// Protected routes
router.post("/", createItem); // Create
router.delete("/:itemId", deleteItem); // Delete
router.put("/:itemId/likes", likeItem); // Like
router.delete("/:itemId/likes", disLikeItem); // Dislike

module.exports = router;
