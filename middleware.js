const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utilitu/ExpressError.js");
const wrapAsync = require("./utilitu/wrapAsync.js");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user._id);
  // console.log(req.originalUrl , req.path)

  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "user must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  // console.log(listing.owner._id, res.locals.currUser.id);
  if (!listing.owner.equals(res.locals.currUser.id)) {
    req.flash("error", "you are not owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  // console.log(listing.owner._id, res.locals.currUser.id);
  console.log(review);
  if (!review.author.equals(res.locals.currUser.id)) {
    req.flash("error", "you are not author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    // console.log(error.details);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  // let result = reviewSchema.validate(req.body);
  // console.log(result);
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    console.log(error.details);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};