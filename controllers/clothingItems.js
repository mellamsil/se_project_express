const ClothingItem = require("../models/clothingItems");

/* eslint-disable no-unused-vars */
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
  OkError,
  CreatedError,
  NoContentError,
  ForbiddenError,
  ConflictError,
} = require("../utils/errors");
/* eslint-enable no-unused-vars */

const clothingItems = require("../models/clothingItems");

// GET /items
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      next(new InternalServerError("An error has occurred on the server"));
    });
};

// POST /items
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Invalid data" });
      } else {
        res
          .status(500)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

// Like an item by ID
const likeItem = (req, res, next) => {
  const userId = req.user._id;
  clothingItems
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid data" });
      }

      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      return res
        .status(500)
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
    .orFail()
    .then((item) => {
      res.setHeader("Content-Type", "application/json");
      res.send({ data: item });
    })

    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "No item found with that ID" });
      }

      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid Input" });
      }

      return res
        .status(500)
        .send({ message: "An error has occurred on the server" });
    });
};

// DELETE /items
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }

      if (!item.owner.equals(req.user._id)) {
        return res
          .status(403)
          .send({ message: "That item is not yours. You cannot delete it" });
      }

      return ClothingItem.deleteOne({ _id: itemId }).then((deleteResult) => {
        if (deleteResult.deletedCount === 0) {
          return res
            .status(404)
            .send({ message: "Item not found or already deleted" });
        }
        return res.status(200).send({ message: "Item successfully deleted" });
      });
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID format" });
      }

      return res
        .status(500)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  disLikeItem,
};
