require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
var app = express();
const cors = require("cors");
const auth = require("./middlewares/express-jwt");
const errorHandler = require("./middlewares/error-handler");

// connect to data base
const { connectDb } = require("./config/db.config");
connectDb();

// middle ware
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(auth());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

//router
const authRouter = require("./routes/auth.routes");
const categoryRouter = require("./routes/category.routes");
const productRouter = require("./routes/product.routes");
const rateRouter = require("./routes/rate.routes");
const orderRouter = require("./routes/order.routes");
const cartRouter = require("./routes/cart.routes");

app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/rate", rateRouter);
app.use("/order", orderRouter);
app.use("/cart", cartRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
