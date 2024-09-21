const usermodel=require("../models/user.js");

module.exports.signupfrom= (req, res) => {
    res.render("signup.ejs");
  };

module.exports.signup=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newuser = new usermodel({ username, email });
      const registrUser = await usermodel.register(newuser, password);
      
      // redirect page after sign up
      req.login(registrUser,(err)=>{
        if(err){
          return next(err);
        }else{
          req.flash("msuccess", "User registration succesfull");
          res.redirect("/index");
        }
      })
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };


  module.exports.loginFrom=(req, res) => {
    res.render("login.ejs");
  };

  module.exports.login=async (req, res) => {
    req.flash('success', 'Successfully logged in');
    let redirectUrl=res.locals.redirectUrl || "/index" ;
    res.redirect(redirectUrl);
  };


  module.exports.logOut=(req,res,next)=>{
    req.logOut((err)=>{
      if(err){
        return next(err);
      }else{
        req.flash("dlt","logout succesfull");
        res.redirect("/index");
      }
    })
  };