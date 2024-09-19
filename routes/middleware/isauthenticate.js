const listening=require("../../models/listening.js")
const reviewmodel=require("../../models/review.js");
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



module.exports.isOwner =async (req,res,next)=>{
  let {id}=req.params;
  let product=await listening.findById(id);
      if(!product.owner._id.equals(res.locals.curentuser._id)){
        req.flash("error","You don't have  permission to modify and delete");
       return res.redirect(`/show/${id}`);
       }
       next()
};


module.exports.isreviewAuthor =async (req,res,next)=>{
  let {id,reviewid}=req.params;
  let review=await reviewmodel.findById(reviewid);
      if(!review.Author._id.equals(res.locals.curentuser._id)){
        req.flash("error","You don't have  permission to  delete this review");
       return res.redirect(`/show/${id}`);
       }
       next()
};

