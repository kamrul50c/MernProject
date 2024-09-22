const listening=require("../models/listening.js");



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
    let url=req.file.path;
    let filename=req.file.filename;
    console.log("path",url,"name",filename,"req body",req.body);
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
    res.render("edit.ejs", { currentproduct });
  };

  module.exports.update=async (req, res) => {
    let { id } = req.params;
    let updateData = req.body;
    await listening.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    req.flash("success","listing is updated");

    res.redirect(`/show/${id}`);
  };

