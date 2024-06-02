const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let allListing = await Listing.find({});
  res.render("./listings/index.ejs", { allListing });
};

//new page
module.exports.createNew = (req, res) => {
  res.render("./listings/new.ejs");
};

//add new page
module.exports.addNew = async (req, res, next) => {
  let filename = req.file.filename;
  let url = req.file.path;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  console.log(newListing);
  await newListing.save();
  req.flash("success", "New Listing is added");
  res.redirect("/listings");
};

//Search Listings
module.exports.searchListing = async (req, res) => {
  let { country } = req.query;

  if (country) {
    let listings = await Listing.find({ country: new RegExp(country, "i") });
    if (listings.length > 0) {
      res.render("./listings/showSearch.ejs", { listings });
    } else {
      throw new ExpressError(400, "This area of listing is not available");
    }
  }
};

// showPage
module.exports.showPage = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist !");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

// edit page
module.exports.renderEdit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist !");
    res.redirect("/listings");
  }
  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_250");
  res.render("./listings/edit.ejs", { listing, originalUrl });
};

// update listing
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let filename = req.file.filename;
    let url = req.file.path;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Edit Successful");
  res.redirect(`/listings/${id}`);
};

//delete
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", "Listing is deleted");
  res.redirect("/listings");
};

//Filter the Listings
module.exports.filterListing = async (req, res) => {
  const category2 = req.params.category;
  console.log(category2);

  try {
    const allListing = await Listing.find({
      category: new RegExp(category2, "i"),
    });
    if (allListing.length === 0) {
      req.flash(
        "error",
        "Listing is not availavle related to the this category."
      );
      res.redirect("/listings");
    } else {
      res.render("./listings/index.ejs", { allListing });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching listings");
  }
};
