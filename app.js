const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const listening = require("./models/listening.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Cerror = require("./utility/ExpressError.js");
const Wrap_async=require("./utility/wrap_async.js");
const productSchema = require("./productSchema.js"); 


const { runInNewContext } = require("vm");
const wrap_async = require("./utility/wrap_async.js");

app.use(methodOverride("_method"));

app.use(express.json());
// Set up EJS as the view engine
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname,"/public")));
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

//root route

app.get("/", (req, res) => {
  res.render("root.ejs");
});

//home route
app.get("/index",wrap_async( async (req, res) => {
  let list = await listening.find();
  res.render("home.ejs", { list });
}));

//show route

app.get("/show/:id",wrap_async( async (req, res) => {
  
  let { id } = req.params;
  const product = await listening.findById(id);
  res.render("show.ejs", { product });
}));

// new

app.get("/new", (req, res) => {
  res.render("create.ejs");
});

//create
app.post("/create", wrap_async(  async (req, res,next) => {


const {error}=productSchema.validate(req.body);
if (error) {
  console.log(error.details);
 throw new Cerror(400, error.details[0].message);  // Handle validation error
}
  
  let newproduct = new listening(req.body);
  await newproduct.save();

  res.redirect("/index");
}));

// /delete route

app.delete("/delete/:id",wrap_async( async (req, res) => {
  let { id } = req.params;
  await listening.findByIdAndDelete(id);
  res.redirect("/index");
}));

//update route

app.get("/edit/:id",wrap_async( async (req, res) => {
  //Scema validation
  const {error}=productSchema.validate(req.body);
if (error) {
  console.log(error.details);
 throw new Cerror(400, error.details[0].message);  // Handle validation error
}
  let { id } = req.params;
  let currentproduct = await listening.findById(id);
  res.render("edit.ejs", { currentproduct });
}));

app.put("/update/:id",wrap_async( async (req, res) => {

  const { title, description, price, location, country } = req.body;
 // Check if req.body or required fields are missing
 if (!req.body || !title || !description || !price || !location || !country) {
  throw new Cerror(400, "Invalid or missing data");
}
 // Validate that price is a non-negative number
 const priceValue = parseFloat(price);
 if (isNaN(priceValue) || priceValue < 0) {
   throw new Cerror(400, "Price must be a number and non-negative");
 }
  let { id } = req.params;
  let updateData = req.body;
  await listening.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.redirect("/index");
}));

// invalid route 
app.all("*",(req,res,next)=>{
  next(new Cerror(404,"page not found"));
});

//express error
app.use((err,req,res,next)=>{
  let {status=500, message="some Error found"}=err;
  res.status(status).render("Error.ejs",{err});
});