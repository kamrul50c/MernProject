module.exports.islogin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","login first!");
        return res.redirect("/login");
      }
      next();
};