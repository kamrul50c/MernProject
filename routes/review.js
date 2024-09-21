const express =require("express");
const route=express.Router({mergeParams:true});
const wrap_async = require("../utility/wrap_async.js");
const Cerror = require("../utility/ExpressError.js");
const {islogin, isreviewAuthor }= require("./middleware/isauthenticate.js");

const controllerReview=require("../controller/reviews.js")

//validate schema require 
const reviewSchema=require("../validateSchema/reviewvaliditation.js");

const reviewValidate=(req,res,next)=>{
  
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    let msgerr=error.details.map((el)=>el.message).join(",")
    throw new Cerror(400, msgerr); // Handle validation error
  } else {
    next();
  }

};
//review  post route
route.post("/product/:id/review",islogin, reviewValidate, wrap_async(controllerReview.addREview));

//review delete route
route.delete("/product/:id/remove/:reviewid",islogin,isreviewAuthor,wrap_async( controllerReview.destroyReview));

module.exports = route;