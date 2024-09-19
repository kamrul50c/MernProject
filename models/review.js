const mongoose=require("mongoose");
const { strict, type, min, max } = require("../validateSchema/productSchema");
const { date, types } = require("joi");

const  reviewSchema= new mongoose.Schema({
    comment:String,
    rating:{
        type:Number,max:5,min:1
    },
    createdat:{
        type:Date,
        default:Date.now()
    },
    Author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
});


const review= mongoose.model("review", reviewSchema);

module.exports=review;