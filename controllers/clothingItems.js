const e = require("express");
const ClothingItem = require("../models/clothingItems");
const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  OK,
  CREATED,
  NO_CONTENT,
} = require("../utils/errors");
const clothingItems = require("../models/clothingItems");

// GET /items
const getItems = (req, res) => {
  console.log("Check if this item was retrieved");
  ClothingItem.find({})
    .then((items) => res.status(OK).send(items))
    .catch((e) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// POST /items
const createItem = (req, res) => {
  console.log("Check if this item has been created ");
  console.log(req);
  console.log(req.body);
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._Id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.status(CREATED).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Like an item by ID
const LikeItem = (req, res) => {
  const userId = req.user._id;
  clothingItems
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._Id } },
      { new: true }
    )
    .orFail()
    .then((item) => {
      res.status(OK).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }

      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Dislike an item by ID
const disLikeItem = (req, res) => {
  clothingItems
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      const error = new Error("No item found with that id");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => {
      res.setHeader("Content-Type", "application/json");
      res.send({ data: item });
    })
    .catch((err) => {
      console.error("Dislike Item Error:", err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// DELETE /items
const deleteItem = (req, res) => {
  console.log("Check if this item was deleted ");
  const { itemId } = req.params;
  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const err = new Error("Item ID not found");
      err.statusCode = 404;
      throw err;
    })
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      res.status(OK).send({ message: "Item is successfully deleted" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST);
      }
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Error from deleteItem" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  LikeItem,
  disLikeItem,
};
