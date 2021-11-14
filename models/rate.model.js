const mongoose = require('mongoose');
const { Category } = require('../../../models/category');
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
    average:{
        type:Number,
        required:true
    },
    user:{
        type:objectId,
        ref:'users'
    }
})

const RATE  = mongoose.model('rates',ratingSchema);

module.exports = {RATE};



