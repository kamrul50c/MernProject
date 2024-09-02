const express = require("express");
const route = express.Router();
const wrap_async = require("../utility/wrap_async.js");
const Cerror = require("../utility/ExpressError.js");
const usermodel = require("../models/user.js");
const validateuser = require("../validateSchema/uservalidateSchema.js");
const passport = require("passport");

//validateproduct function
const validateuserf = (req, res, next) => {
  const { error } = validateuser.validate(req.body);
  if (error) {
    let msgerr = error.details.map((el) => el.message).join(",");
    throw new Cerror(400, msgerr); // Handle validation error
  } else {
    next();
  }
};

//signup route
route.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

route.post(
  "/signup",
  validateuserf,
  wrap_async(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newuser = new usermodel({ username, email });
      await usermodel.register(newuser, password);
      req.flash("msuccess", "User registration succesfull");
      res.redirect("/index");
    } catch (e) {
      req.flash("err", e.message);
      res.redirect("/signup");
    }
  })
);

//login route

route.get("/login", (req, res) => {
  res.render("login.ejs");
});

route.post('/login', 
    passport.authenticate('local', {
      failureRedirect: '/login',failureFlash:true,
      
    }), 
    async (req, res) => {
      req.flash('success', 'Successfully logged in');
      res.redirect('/index');
    }
  );
module.exports = route;
