const mongoose=require("mongoose");
const { strict, type, min, max } = require("../validateSchema/productSchema");
const { date } = require("joi");

const  reviewSchema= new mongoose.Schema({
    comment:String,
    rating:{
        type:Number,max:5,min:1
    },
    createdat:{
        type:Date,
        default:Date.now()
    }
});


const review= mongoose.model("review", reviewSchema);

module.exports=review;