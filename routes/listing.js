const express =require("express");
const route=express.Router({mergeParams:true});

const wrap_async = require("../utility/wrap_async.js");
const listening = require("../models/listening.js");
const Cerror = require("../utility/ExpressError.js");
const productSchema = require("../validateSchema/productSchema.js");

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
//flash err function
  let flasherr=(value, msg,req,res)=>{
      if(!value){
        req.flash("error",msg);
        res.redirect("/index");
      }
  }
  
  //root route
  
  route.get("/", (req, res) => {
    res.render("root.ejs");
  });
  
  //home route
  route.get(
    "/index",
    wrap_async(async (req, res) => {
      let list = await listening.find();
      res.render("home.ejs", { list });
    })
  );
  
  //show route
  
  route.get(
    "/show/:id",
    wrap_async(async (req, res) => {
      let { id } = req.params;
      const product = await listening.findById(id).populate("review");
      flasherr(product ,"The listing you want to show doesn't exist",req,res);
      res.render("show.ejs", { product });
    })
  );
  
  // new
  
  route.get("/new", (req, res) => {
    if(!req.isAuthenticated()){
      req.flash("error","login first!");
      return res.redirect("/login");
    }
    res.render("create.ejs");
  });
  
  //create
  route.post(
    "/create",
    validateproduct,
    wrap_async(async (req, res, next) => {
      let newproduct = new listening(req.body);
      await newproduct.save();
      req.flash("success", "New listing created!");
      res.redirect("/index");
    })
  );
  
  // /delete route
  
  route.delete(
    "/delete/:id",
    wrap_async(async (req, res) => {
      let { id } = req.params;
      await listening.findByIdAndDelete(id);
      req.flash("dlt","succesfully delete The listing!");
      res.redirect("/index");
    })
  );
  
  //update route
  
  route.get(
    "/edit/:id",
    wrap_async(async (req, res) => {
      let { id } = req.params;
      let currentproduct = await listening.findById(id);
      flasherr(currentproduct,"The listing you have search dosen't exist",req,res);
      res.render("edit.ejs", { currentproduct });
    })
  );
  
  route.put(
    "/update/:id",
    validateproduct,
    wrap_async(async (req, res) => {
      let { id } = req.params;
      let updateData = req.body;
      await listening.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      req.flash("success","listing is updated");
  
      res.redirect(`/show/${id}`);
    })
  );
  




  module.exports=route;