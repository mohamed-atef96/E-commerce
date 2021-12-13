const mongoose = require("mongoose");
const {Schema} = mongoose;
const objectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new Schema({
  user: {
    type: objectId,
    ref: "users",
    required: true,
  },
  orderItems: [
    {
      type: objectId,
      ref: "OrderItems",
      required: true,
    }
  ],
  total: {  
    type: Number,
    required: true,
  },
  shippingAddress: {
    governorate: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
  },
  phone: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const ORDER = mongoose.model("orders", orderSchema);
module.exports = { ORDER };
