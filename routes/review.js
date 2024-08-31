const express =require("express");
const route=express.Router({mergeParams:true});

const wrap_async = require("../utility/wrap_async.js");
const Cerror = require("../utility/ExpressError.js");
const listening = require("../models/listening.js");



const validateproduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if (error) {
      let msgerr=error.details.map((el)=>el.message).join(",")
      throw new Cerror(400, msgerr); // Handle validation error
    } else {
      next();
    }
  };

// review 
const review=require("../models/review.js");
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
route.post("/product/:id/review", reviewValidate, wrap_async(  async (req,res)=>{
  let rproduct=await listening.findById(req.params.id);
  let newReview= new review(req.body);
  rproduct.review.push(newReview);

  await rproduct.save();
  await newReview.save();

  res.redirect(`/show/${rproduct._id}`);

}))

//review delete route
route.delete("/product/:id/remove/:reviewid",wrap_async( async(req,res,err)=>{
       let {id, reviewid}=req.params;
       await review.findByIdAndDelete(reviewid);
       await listening.findByIdAndUpdate(id,{$pull:{review:reviewid}});
       res.redirect(`/show/${id}`);

}));



module.exports = route;