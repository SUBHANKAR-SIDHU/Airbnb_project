const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../auth.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const listingController = require("../controllers/listings.js");

let listingValidation = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMess = error.details.map((elem) => elem.message).join(",");
    throw new ExpressError(400, errMess);
  } else {
    next();
  }
};

//index routes and create routes
router
  .route("/")
  .get(wrapAsync(listingController.index))
  // .post(
  //   isLoggedIn,
  //   listingValidation,
  //   wrapAsync(listingController.createListing),
  // );
  .post(upload.single("listing[image]"), (req, res) => {
    res.send(req.file);
  });

//new routes
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

//show , update and delete
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//edit routes
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing),
);

module.exports = router;
