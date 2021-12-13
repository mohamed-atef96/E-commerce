const mongoose = require('mongoose');
const {Schema} = mongoose;
const objectId = mongoose.Schema.Types.ObjectId;
const cartItemSchema =new Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type:objectId,
        ref: 'products',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const CARTITEMS = mongoose.model('cartItems', cartItemSchema);
module.exports = {CARTITEMS}