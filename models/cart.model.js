const mongoose = require('mongoose');
const {Schema}  = mongoose;
const objectId = mongoose.Schema.Types.ObjectId

const cartSchema = new Schema({
    items:[{
        type:objectId,
        ref:'products'
    }],
    quantity:{
        type:Number,
        required:true
    },
    user:{
        type:objectId,
        ref:'users'
    }
})

const CART = mongoose.model('cart' , cartSchema);
module.exports = {CART};

