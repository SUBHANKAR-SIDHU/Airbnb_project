const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../auth.js");

const reviwController = require("../controllers/reviews.js")

const reviewValidation = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMess = error.details.map((elem) => elem.message).join(",");
    throw new ExpressError(400, errMess);
  } else {
    next();
  }
};


//create review route
router.post(
  "/",
  isLoggedIn,
  reviewValidation,
  wrapAsync(reviwController.createReview),
);

//delete review

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviwController.destroyReview),
);

module.exports  = router;

