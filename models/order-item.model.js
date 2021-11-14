const mongoose = require('mongoose');
const {Schema} = mongoose;

const orderItemSchema =new Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    }
})

const ORDERITEM = mongoose.model('OrderItems', orderItemSchema);
module.exports = {ORDERITEM}
