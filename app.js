var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
require("dotenv").config();
var app = express();

// connect to data base
const { connectDb } = require("./config/db.config");
connectDb();


// middle ware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//router
const authRouter = require('./routes/auth.routes');
const categoryRouter = require('./routes/category.routes');
const productRouter = require('./routes/product.routes');

app.use('/auth',authRouter);
app.use('/category',categoryRouter);
app.use('/product',productRouter)








// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
