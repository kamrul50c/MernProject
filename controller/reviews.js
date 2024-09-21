const listening = require("../models/listening");
const review=require("../models/review");

module.exports.addREview= async (req,res)=>{
    let rproduct=await listening.findById(req.params.id);
    let newReview= new review(req.body);
    rproduct.review.push(newReview);
    newReview.Author=req.user._id;
    await rproduct.save();
    await newReview.save();
      req.flash("success","A new review added");
    res.redirect(`/show/${rproduct._id}`);
  
  };


  module.exports.destroyReview=async(req,res)=>{
    let {id, reviewid}=req.params;
    let selected_review=await review.findByIdAndDelete(reviewid);
    if(!selected_review){
     req.flash("error","review that you have search dosen't exist");
    }
    await listening.findByIdAndUpdate(id,{$pull:{review:reviewid}});
    req.flash("dlt","succesfully delete The review!");
    res.redirect(`/show/${id}`);

};