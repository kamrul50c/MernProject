const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const { runInNewContext } = require("vm");


const listing=require("./routes/listing.js");
const review=require("./routes/review.js");
const userroute=require("./routes/user.js");
const session=require("express-session");
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const possportlocalmongoose=require("passport-local-mongoose");
const User=require("./models/user.js");

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



//session
const sessionoption={
  secret:"mysuppersecrat",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}



app.use(session(sessionoption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.deleteMessage =req.flash("dlt");
  res.locals.curentuser=req.user;

  next();
});

//route 
app.use("/",listing);
app.use("/",review);
app.use("/",userroute);





// invalid route
app.all("*", (req, res, next) => {
  next(new Cerror(404, "page not found"));
});

//express error
app.use((err, req, res, next) => {
  let { status = 500, message = "some Error found" } = err;
  res.status(status).render("Error.ejs", { err });
});
