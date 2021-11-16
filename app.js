var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
require("dotenv").config();
var app = express();
const auth = require('./middlewares/express-jwt');
const errorHandler = require('./middlewares/error-handler')

// connect to data base
const { connectDb } = require("./config/db.config");
connectDb();


// middle ware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(auth())

//router
const authRouter = require('./routes/auth.routes');
const categoryRouter = require('./routes/category.routes');
const productRouter = require('./routes/product.routes');
const rateRouter = require('./routes/rate.routes');

app.use('/auth',authRouter);
app.use('/category',categoryRouter);
app.use('/product',productRouter);
app.use('/rate',rateRouter)








// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
