const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../auth.js");

const listingController = require("../controllers/listings.js")

let listingValidation = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMess = error.details.map((elem) => elem.message).join(",");
    throw new ExpressError(400, errMess);
  } else {
    next();
  }
};
//index routes
router.get(
  "/",
  wrapAsync(listingController.index),
);

//new routes
router.get(
  "/new",
  isLoggedIn,
  wrapAsync(listingController.renderNewForm),
);

// show routes
router.get(
  "/:id",
  wrapAsync(listingController.showListing),
);

//create routes
router.post(
  "/",
  isLoggedIn,
  listingValidation,
  wrapAsync(listingController.createListing),
);

//edit routes
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing),
);

//update routes
router.put(
  "/:id/",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.updateListing),
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing),
);

module.exports = router;
