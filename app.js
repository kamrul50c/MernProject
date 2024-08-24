const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const listening = require("./models/listening.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
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
app.get("/index", async (req, res) => {
  let list = await listening.find();
  res.render("home.ejs", { list });
});

//show route

app.get("/show/:id", async (req, res) => {
  let { id } = req.params;
  const product = await listening.findById(id);
  res.render("show.ejs", { product });
});

// new

app.get("/new", (req, res) => {
  res.render("create.ejs");
});

//create
app.post("/create", async (req, res) => {
  //   let {title,description,price,location,country}=req.body;
  //   let product= new listening({
  //     title:title,
  //     description:description,
  //     price:price,
  //     location:location,
  //     country:country,
  //   });
  // await product.save();

  let newproduct = new listening(req.body);
  await newproduct.save();

  res.redirect("/index");
});

// /delete route

app.delete("/delete/:id", async (req, res) => {
  let { id } = req.params;
  await listening.findByIdAndDelete(id);
  res.redirect("/index");
});

//update route

app.get("/edit/:id", async (req, res) => {
  let { id } = req.params;
  let currentproduct = await listening.findById(id);
  res.render("edit.ejs", { currentproduct });
});

app.put("/update/:id", async (req, res) => {
  let { id } = req.params;
  let updateData = req.body;
  await listening.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.redirect("/index");
});
