const express = require('express');
const router = express.Router();
const {CARTITEMS: CARTITEMS} = require('../models/cart-items.model')
const {CART} = require('../models/cart.model')
const {PRODUCT} = require('../models/product.model')
  
module.exports = router;
