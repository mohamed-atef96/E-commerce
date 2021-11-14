const mongoose = require('mongoose');
const {Schema} = mongoose;
const objectId = mongoose.Schema.Types.ObjectId

const productSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    images:[{
        type:String
    }],
    brand:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        default:0
    },
    discount:{
        percentage:{
            type:Number
        },
        newPrice:{
            type:Number
        }  
    },
    category:{
        type:objectId,
        ref:'categories',
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    available:{
        type:Boolean,
        default:true
    },
    averageRate:{
      type:Number,
      default:0 
    },
    numRating:{
        type:Number,
        default:0
    },
    isFeatured:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }

})

const PRODUCT = mongoose.model('products',productSchema);
module.exports = {PRODUCT};