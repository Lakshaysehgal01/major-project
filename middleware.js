const listingSchema = require("./joischema.js");
const expressError = require("./utils/ExpressError.js");
const Listing=require("./models/listing.js");
const reviewSchema=require("./reviewJoiSchema.js");
const Review = require("./models/review.js");
module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("err","Login to access this feature");
        return res.redirect("/login");
    }
        next();  
}
module.exports.saveUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.saveUrl=req.session.redirectUrl
    }
    next();
}
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        // console.log(error.error)
        next(new expressError(400, error.error));
    } else {
        next();
    }
}
module.exports.validateReview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        // console.log(error)
        // console.log(error.error)
        next(new expressError(400, error.error));
    } else {
        next();
    }
}
module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("err","you don't have the authority to do this")
        return res.redirect(`/listing/${id}`)
    }
    next()
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    let { id, reviewId } = req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("err","You are not the author of the review");
        return res.redirect(`/listing/${id}`)
    }
    next()
}