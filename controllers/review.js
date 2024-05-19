const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
module.exports.saveReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(`${id}`)
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);
    await newReview.save()
    await listing.save()
    console.log("review saved");
    req.flash("success", "Added Successfully");
    res.redirect(`/listing/${id}`)
}
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(`${reviewId}`)
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } })
    console.log("review deleted")
    req.flash("delmsg", "Deleted Successfully")
    res.redirect(`/listing/${id}`)

}