const mongoose = require('mongoose');
const {Schema} = mongoose;
const objectId = mongoose.Schema.Types.ObjectId

const rateSchema = new Schema({
    product:{
        type:objectId,
        ref:'products'
    },
    rate:{
        type:Number,
        enum:[1,2,3,4,5],
        required:true

    },
    user:{
        type:objectId,
        ref:'users'
    }
})

const RATE  = mongoose.model('rates',rateSchema);

module.exports = {RATE};



