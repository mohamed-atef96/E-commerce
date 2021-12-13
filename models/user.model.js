const mongoose = require('mongoose');
const {Schema} = mongoose;
const objectId = mongoose.Schema.Types.ObjectId

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    hashPassword:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
    },
    address:{
        governorate:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        street:{
            type:String,
            required:true
        }
    },
    history:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products'
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    cart:{
        type:objectId,
        ref:'carts',
        requires:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

const USER = mongoose.model('users',userSchema)
module.exports = {USER}