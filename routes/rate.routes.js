const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { RATE } = require("../models/rate.model");
const { USER } = require("../models/user.model");
const { PRODUCT } = require("../models/product.model");
// get rates by product id
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  const product = await PRODUCT.findById(productId);
  if (!product) return res.status(401).json({ msg: "Invalid Product" });
  const rate = await RATE.find({ product: productId });
  res.status(200).json(rate);
});

// get rates counts of product
router.get("/rateCount/:productId", async (req, res) => {
  const { productId } = req.params;
  const product = await PRODUCT.findById(productId);
  if (!product) return res.status(401).json({ msg: "Invalid Product" });
  const rateCount = await RATE.find({ product: productId }).countDocuments();
  if (!rateCount) {
    res.send(500).json({ success: false });
  }

  res.send({ rateCount });
});

// get average of product rating
router.get("/averageRate/:productId", async (req, res) => {
  const { productId } = req.params;
  const product = await PRODUCT.findById(productId);
  if (!product) return res.status(401).json({ msg: "Invalid Product" });
  const avgRate = await RATE.aggregate([
    { $match: { product: ObjectId(productId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rate" },
      },
    },
  ]);

  res.send(avgRate);
});


// add rate and update product info
router.post("/addRate", async (req, res) => {
  const { userId, productId, rate } = req.body;
  // validate inputs
  const user = await USER.findById(userId);
  if (!user) return res.status(401).json({ msg: "Invalid User" });
  const product = await PRODUCT.findById(productId);
  if (!product) return res.status(401).json({ msg: "Invalid Product" });
  // check if this user has rated this product before
  const hasRated = await RATE.findOne({ product: productId, user: userId });
  if (hasRated)
    return res
      .status(401)
      .json({ msg: "This User Has Rated This Product Before" });
  const Rate = new RATE({
    product: productId,
    user: userId,
    rate,
  });
  await Rate.save();
  if (!Rate) return res.status(401).json({ msg: "Error Cannot Rating" });
  // to update rate count in product
  const rateCount = await RATE.find({ product: productId }).countDocuments();
  // to calc average rate of product
  const avgRate = await RATE.aggregate([
    { $match: { product: ObjectId(productId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rate" },
      },
    },
  ]);

  const updateProduct = await PRODUCT.findByIdAndUpdate(productId, {
    averageRate: avgRate[0].averageRating,
    numRating: rateCount,
  });
  res.status(200).json({ Rate });
});

module.exports = router;
