const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const listening = require("./models/listening.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Cerror = require("./utility/ExpressError.js");
const Wrap_async = require("./utility/wrap_async.js");
const productSchema = require("./productSchema.js");

const { runInNewContext } = require("vm");
const wrap_async = require("./utility/wrap_async.js");

app.use(methodOverride("_method"));

app.use(express.json());
// Set up EJS as the view engine
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
// Start the server only after successful connection
app.listen(port, () => {
  console.log("app is listening at port 8080");
});
main();

// MongoDB connection function
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/prdb");
}

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

app.get("/", (req, res) => {
  res.render("root.ejs");
});

//home route
app.get(
  "/index",
  wrap_async(async (req, res) => {
    let list = await listening.find();
    res.render("home.ejs", { list });
  })
);

//show route

app.get(
  "/show/:id",
  wrap_async(async (req, res) => {
    let { id } = req.params;
    const product = await listening.findById(id).populate("review");
    res.render("show.ejs", { product });
  })
);

// new

app.get("/new", (req, res) => {
  res.render("create.ejs");
});

//create
app.post(
  "/create",
  validateproduct,
  wrap_async(async (req, res, next) => {
    let newproduct = new listening(req.body);
    await newproduct.save();

    res.redirect("/index");
  })
);

// /delete route

app.delete(
  "/delete/:id",
  wrap_async(async (req, res) => {
    let { id } = req.params;
    await listening.findByIdAndDelete(id);
    res.redirect("/index");
  })
);

//update route

app.get(
  "/edit/:id",
  wrap_async(async (req, res) => {
    let { id } = req.params;
    let currentproduct = await listening.findById(id);
    res.render("edit.ejs", { currentproduct });
  })
);

app.put(
  "/update/:id",
  validateproduct,
  wrap_async(async (req, res) => {
    let { id } = req.params;
    let updateData = req.body;
    await listening.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.redirect("/index");
  })
);

// review 
const review=require("./models/review.js");
//validate schema require 
const reviewSchema=require("./reviewvaliditation.js");

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
app.post("/product/:id/review", reviewValidate, wrap_async(  async (req,res)=>{
  let rproduct=await listening.findById(req.params.id);
  let newReview= new review(req.body);
  rproduct.review.push(newReview);

  await rproduct.save();
  await newReview.save();

  res.redirect(`/show/${rproduct._id}`);

}))

//review delete route
app.delete("/product/:id/remove/:reviewid",wrap_async( async(req,res,err)=>{
       let {id, reviewid}=req.params;
       await review.findByIdAndDelete(reviewid);
       await listening.findByIdAndUpdate(id,{$pull:{review:reviewid}});
       res.redirect(`/show/${id}`);

}));

// invalid route
app.all("*", (req, res, next) => {
  next(new Cerror(404, "page not found"));
});

//express error
app.use((err, req, res, next) => {
  let { status = 500, message = "some Error found" } = err;
  res.status(status).render("Error.ejs", { err });
});
