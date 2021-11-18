const express = require("express");
const router = express.Router();
const { PRODUCT } = require("../models/product.model");
const { CATEGORY } = require("../models/category.model");
const multer = require("multer");

const fileType = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = fileType[file.mimetype];
    let imageTypeError = new Error("invalid image type");
    if (isValid) {
      imageTypeError = null;
    }
    cb(imageTypeError, "public/uploads");
  },
  filename: function (req, file, cb) {
    //remove spaces from file name if exist
    const fileName = file.originalname.split(" ").join("-");
    const extension = fileType[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});
const upload = multer({ storage: storage });

// get all products
router.get("/", async (req, res) => {
  const categories = req.query.categories;
  let filter = {};
  if (categories) {
    filter = { category: categories.split(",") };
  }
  const products = await PRODUCT.find(filter).populate("category");
  if (!products)
    return res.status(500).json({ msg: "Error Canno't Get Products" });
  res.status(200).send(products);
});

// get a product by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const products = await PRODUCT.findById(id).populate("category");
  if (!products)
    return res.status(500).json({ msg: "Error Canno't Get Product" });
  res.status(200).send(products);
});

// get featured products
router.get("/get/featured", async (req, res) => {
  const count = req.query.count ? req.query.count : 6;
  const products = await PRODUCT.find({ isFeatured: true })
    .populate("category")
    .limit(Number(count));
  if (!products)
    return res.status(500).json({ msg: "Error Canno't Get Product" });
  res.status(200).send(products);
});

// get new products
router.get("/get/new", async (req, res) => {
  const count = req.query.count ? req.query.count : 6;
  const products = await PRODUCT.find()
    .sort({ createdAt: -1 })
    .populate("category")
    .limit(Number(count));
  if (!products)
    return res.status(500).json({ msg: "Error Canno't Get Product" });
  res.status(200).send(products);
});

// get top rated
router.get("/get/topRated", async (req, res) => {
  const count = req.query.count ? req.query.count : 6;
  const products = await PRODUCT.find()
    .sort({ averageRate: -1 })
    .populate("category")
    .limit(Number(count));
  if (!products)
    return res.status(500).json({ msg: "Error Canno't Get Product" });
  res.status(200).send(products);
});

// get top deals
router.get("/get/topDeals", async (req, res) => {
  const count = req.query.count ? req.query.count : 6;
  const products = await PRODUCT.find()
    .sort({ discount: -1 })
    .populate("category")
    .limit(Number(count));
  if (!products)
    return res.status(500).json({ msg: "Error Canno't Get Product" });
  res.status(200).send(products);
});

// get count of all products
router.get("/get/count", async (req, res) => {
  let productCount = await PRODUCT.countDocuments();

  if (!productCount) {
    res.send(500).json({ success: false });
  }

  res.send({ productCount: productCount });
});

// create new product
router.post("/create", upload.array("images", 10), async (req, res) => {
  const { name, description, brand, price, categoryId, quantity } = req.body;
  const category = await CATEGORY.findById(categoryId);
  if (!category) return res.status(401).json({ msg: "Category Not Found" });
  const files = req.files;
  const baseUrl = `${req.protocol}://${req.get("host")}/public/images`;
  const imagesPaths = [];
  if (files) {
    files.map((image) => imagesPaths.push(`${baseUrl}${image.filename}`));
  }

  const product = new PRODUCT({
    name,
    description,
    brand,
    images: imagesPaths,
    price,
    quantity,
    category: categoryId,
  });

  await product.save();
  if (!product) return res.status(401).json({ msg: "Faild To Create Product" });
  res.status(200).send(product);
});

// update category
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, brand, images, price, categoryId, quantity } =
    req.body;

  const category = await CATEGORY.findById(categoryId);
  if (!category) return res.status(401).json({ msg: "Category Not Found" });

  const product = await PRODUCT.findByIdAndUpdate(
    id,
    {
      name,
      description,
      brand,
      images,
      price,
      quantity,
      category: categoryId,
    },
    { new: true }
  ).populate("category");
  if (!product)
    return res.status(401).json({ msg: "Product Cannot Be Updated" });

  res.status(200).send(product);
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const product = await PRODUCT.findByIdAndDelete(id);
  if (!product) return res.status(401).json({ msg: "Product Not Found" });
  res.status(200).json({ msg: "Product Deleted Successfully" });
});

module.exports = router;
