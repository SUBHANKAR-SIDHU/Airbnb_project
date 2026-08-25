const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../auth");
const userController = require("../controllers/users");

router.get("/signup", userController.renderSignUpForm);

router.post("/signup", wrapAsync(userController.userSignUp));

router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.userLogin,
);

router.get("/logout",userController.userLogout);

module.exports = router;
