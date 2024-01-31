const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilitu/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userControllers = require("../controllers/user");

router
  .route("/signUp")
  .get(userControllers.renderSignup)
  .post(wrapAsync(userControllers.signUp));

router
  .route("/login")
  .get(userControllers.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userControllers.login
  );

router.get("/logout", userControllers.logout);
module.exports = router;
