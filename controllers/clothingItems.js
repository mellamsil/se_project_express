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
        .send({ message: "Error from getItems", e });
    });
};

// POST /items
const createItem = (req, res) => {
  console.log("Check if this item has been created ");
  console.log(req);
  console.log(req.body);
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from createItem", e });
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
    .catch((e) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// PUT /items
const updateItem = (req, res) => {
  console.log("Check if this item was updated ");
  const { itemId } = req.params;
  const { imageUrl } = req.body;
  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(OK).send({ data: item }))
    .catch((e) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from updateItemss", e });
    });
};

// DELETE /items
const deleteItem = (req, res) => {
  console.log("Check if this item was deleted ");
  const { itemId } = req.params;
  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(NO_CONTENT).send({});
    })
    .catch((e) => {
      console.error(err);
      if (err.itemId === "ValidationError") {
        return res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "input is incorrect", err });
      }
      return res
        .status(NOT_FOUND)
        .send({ message: "Error from deleteItem", e });
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

    .orFail(new Error("Item not found"))
    .then((item) => {
      res.setHeader("Content-Type", "application/json");
      res.send({ data: item });
    })
    .catch((e) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from dislikeItem", e });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  LikeItem,
  disLikeItem,
};
