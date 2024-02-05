const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilitu/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
// const upload = multer({ dest: "uploads/" }); //baasically intialize the multer
const upload = multer({ storage });
const Listing = require("../models/listing.js");

//index Route
router
  .route("/")
  .get(wrapAsync(listingControllers.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControllers.addNew)
  );
// .post(upload.single("listing[image]"), (req, res) => {
//   res.send(req.file);
// });

router.get(
  "/search",
  wrapAsync(async (req, res) => {
    let { country } = req.query;

    if (country) {
      let listings = await Listing.find({ country: new RegExp(country, "i") });
      if (listings.length > 0) {
        res.render("./listings/showSearch.ejs", { listings });
      } else {
        throw new ExpressError(400, "This area of listing is not available");
      }
    }
  })
);

//create new page
router.get("/new", isLoggedIn, listingControllers.createNew);

// add listing
router
  .route("/:id")
  .get(wrapAsync(listingControllers.showPage))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControllers.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.destroyListing));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.renderEdit)
);

module.exports = router;
