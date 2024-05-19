const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js");
const { validateReview, isLoggedin, isReviewAuthor } = require("../middleware.js");
const reviewController=require("../controllers/review.js");
router.post("/", isLoggedin,validateReview, wrapAsync(reviewController.saveReview))
router.delete("/:reviewId", isReviewAuthor,wrapAsync(reviewController.destroyReview))
module.exports = router