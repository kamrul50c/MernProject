const listening=require("../models/listening.js");
const geocodingClient = require("../geocodingClient.js");
const { response } = require("express");


//flash err function
  let flasherr=(value, msg,req,res)=>{
      if(!value){
        req.flash("error",msg);
        res.redirect("/index");
      }
  }
  

  module.exports.root=(req, res) => {
    res.render("root.ejs");
  };


module.exports.index=async (req, res) => {
    let list = await listening.find();
    res.render("home.ejs", { list });
  };



  module.exports.show=async (req, res) => {
    let { id } = req.params;
    const product = await listening.findById(id).populate(
      {
        path:"review",
        populate:{
          path:"Author",
        },
    })
    .populate("owner");
    
    flasherr(product ,"The listing you want to show doesn't exist",req,res);
    res.render("show.ejs", { product });
  };



  module.exports.newlistiong=(req, res) => {
    
    res.render("create.ejs");
  };


  module.exports.create=async (req, res, next) => {

    let response =await geocodingClient.forwardGeocode({
      query:req.body.location,
      limit:1
    })
    res.json(response.features[0].geometry);
    let url=req.file.path;
    let filename=req.file.filename;
    let newproduct = new listening(req.body);
    newproduct.owner=req.user._id;
    newproduct.image={filename, url};
    await newproduct.save();
    req.flash("success", "New listing created!");
    res.redirect("/index");
  };

  module.exports.destroy=async (req, res) => {
    let { id } = req.params;
    await listening.findByIdAndDelete(id);
    req.flash("dlt","succesfully delete The listing!");
    res.redirect("/index");
  };


  module.exports.edit=async (req, res) => {
    let { id } = req.params;
    const currentproduct = await listening.findById(id);
    flasherr(currentproduct,"The listing you have search dosen't exist",req,res);
    let currentimage=currentproduct.image.url;
    currentimage=currentimage.replaceAll("/upload","/upload/h_200,w_200");
    res.render("edit.ejs", { currentproduct,currentimage });
  };

  module.exports.update=async (req, res) => {
    let { id } = req.params;
    let updateData = req.body;
    let updatelisting =await listening.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if(typeof req.file !="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      updatelisting.image={filename, url};
      await updatelisting.save();
    }
    req.flash("success","listing is updated");

    res.redirect(`/show/${id}`);
  };

