const express = require("express");
const route = express.Router();
const wrap_async = require("../utility/wrap_async.js");
const Cerror = require("../utility/ExpressError.js");
const usermodel = require("../models/user.js");
const validateuser = require("../validateSchema/uservalidateSchema.js");
const passport = require("passport");
const { saverredirecturl } = require("./middleware/isauthenticate.js");
const userController=require("../controller/user.js")


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
route.get("/signup",userController.signupfrom);

route.post("/signup", validateuserf, wrap_async(userController.signup));

//login route

route.get("/login",userController.loginFrom );

route.post('/login', saverredirecturl,passport.authenticate('local', {failureRedirect: '/login',failureFlash:true, }), userController.login);



  //logout
route.get("/logout",userController.logOut);
module.exports = route;
