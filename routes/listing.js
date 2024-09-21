const express =require("express");
const route=express.Router({mergeParams:true});

const wrap_async = require("../utility/wrap_async.js");
const listening = require("../models/listening.js");
const Cerror = require("../utility/ExpressError.js");
const productSchema = require("../validateSchema/productSchema.js");
const {islogin, isOwner}= require("./middleware/isauthenticate.js");
const user=require("../models/user.js")
const controller=require("../controller/listing.js")

//validateproduct function
const validateproduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    let msgerr=error.details.map((el)=>el.message).join(",")
    throw new Cerror(400, msgerr); // Handle validation error
  } else {
    next();
  }
};

  //root route
  
  route.get("/",controller.root);
  
  //home route
  route.get("/index",wrap_async(controller.index));
  
  //show route
  
  route.get("/show/:id", wrap_async(controller.show));
  
  // new
  
  route.get("/new",islogin,controller.newlistiong);
  
  //create
  route.post("/create",islogin,validateproduct,wrap_async(controller.create) );
  
  // /delete route
  
  route.delete("/delete/:id", islogin,isOwner,wrap_async(controller.destroy));
  
  //update route
  
  route.get( "/edit/:id", islogin, isOwner,wrap_async(controller.edit) );
  
  route.put("/update/:id", islogin, isOwner,validateproduct, wrap_async(controller.update));
  




  module.exports=route;