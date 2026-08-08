const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const { isLoggedIn } = require("../auth.js");

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
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  }),
);

//new routes
router.get(
  "/new",isLoggedIn,
  wrapAsync(async (req, res) => {
    res.render("listing/new.ejs");
  }),
);

// show routes
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist !");
      res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing });
  }),
);

//create routes
router.post(
  "/",isLoggedIn,
  listingValidation,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "new listing created");
    res.redirect("/listings");
  }),
);

//edit routes
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist !");
      res.redirect("/listings");
    }
    res.render("listing/edit.ejs", { listing });
  }),
);

//update routes
router.put(
  "/:id/",isLoggedIn,
  wrapAsync(async (req, res) => {
    if (!req.body.Listing) {
      throw new ExpressError(400, "send the validate data");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing updated");
    res.redirect(`/listings/${id}`);
  }),
);

//delete route
router.delete(
  "/:id",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "listing delete");
    res.redirect("/listings");
  }),
);

module.exports = router;
