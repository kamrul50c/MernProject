const mongoose=require("mongoose");
const passportlocalmongoose=require("passport-local-mongoose");
const { type } = require("../validateSchema/productSchema");
const { required } = require("joi");

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
});

UserSchema.plugin(passportlocalmongoose);

module.exports=mongoose.model("User", UserSchema);