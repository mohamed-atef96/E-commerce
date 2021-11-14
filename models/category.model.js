const mongoose = require('mongoose');
const {Schema} = mongoose;

const categorySchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },  
    icon:{
        type:String,
        required:true
    }

})

const CATEGORY = mongoose.model('categories',categorySchema);
module.exports = {CATEGORY}