const express = require("express");
const router = express.Router();
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
router
  .route("/signup")
  .get(userController.signupfrom)
  .post(validateuserf, wrap_async(userController.signup));


//login route

router
  .route("/login")
  .get(userController.loginFrom )
  .post( saverredirecturl,passport.authenticate('local', {failureRedirect: '/login',failureFlash:true, }), userController.login);




  //logout
  router.get("/logout",userController.logOut);

module.exports = router;
