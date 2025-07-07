const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  disLikeItem,
} = require("../controllers/clothingItems");

//CRUD

//Create
router.post("/", createItem);

//Read
router.get("/", getItems);

//Update/Like
router.put("/:itemId/Likes", updateItem);

//DisLike
router.delete("/:itemId/likes", disLikeItem);

//Delete
router.delete("/:itemId", deleteItem);

module.exports = router;
