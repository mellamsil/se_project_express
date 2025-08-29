const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  disLikeItem,
  likeItem,
} = require("../controllers/clothingItems");

const {
  validateCardBody,
  validateIdParam,
} = require("../middleware/validation");

// Public route to get all items
router.get("/", getItems);

// Apply authentication middleware to all routes below
router.use(auth);

// Protected routes with validation
router.post("/", validateCardBody, createItem); // Create item
router.delete("/:itemId", validateIdParam, deleteItem); // Delete by ID
router.put("/:itemId/likes", validateIdParam, likeItem); // Like item by ID
router.delete("/:itemId/likes", validateIdParam, disLikeItem); // Dislike item by ID

module.exports = router;
