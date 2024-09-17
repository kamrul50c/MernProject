module.exports.islogin=(req,res,next)=>{
    if(!req.isAuthenticated()){
       
        req.session.redirectUrl=req.originalUrl;
        
        req.flash("error","login first!");
        return res.redirect("/login");
      }
      next();
};

module.exports.saverredirecturl=(req,res,next)=>{
 if(req.session.redirectUrl){
  res.locals.redirectUrl=req.session.redirectUrl;
 }
 next()
};