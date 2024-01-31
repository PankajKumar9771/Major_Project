const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReveiw = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReviews = new Review(req.body.review);
  newReviews.author = req.user._id;
  listing.reviews.push(newReviews);

  await listing.save();
  await newReviews.save();
  req.flash("success", "New Review is added");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview =async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review is deleted");
    res.redirect(`/listings/${id}`);
  }