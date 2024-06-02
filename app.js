// require("dotenv").config()
// console.log(process.env)
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
  // console.log(process.env);
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilitu/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listing = require("./models/listing.js");

// Require Routes
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// const Mongo_Url = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl = process.env.ATLAS_DB_URL;
main()
  .then((res) => {
    console.log("database is connected");
    // console.log(listingSchema,reviewSchema)
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// app.get("/", (req, res) => {
//   res.send("this is root route");
// });

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: "mysecretcode",
  },
  touchAfter: 24 * 3600,
});

const sessionOptions = {
  store,
  secret: "mysecretCode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

store.on("error", () => {
  console.err("ERROR in mongo session store", err);
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// This strategy is commonly used for authenticating users based on local credentials (e.g., username and password) in web

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  // console.log(res.locals.success);
  next();
});

// app.get("/demoUser", async (req, res) => {
//   const fakeUser = new User({
//     email: "abc@gmail.com",
//     username: "abc",
//   });

//   let registerdUser = await User.register(fakeUser, "helloword");
//   res.send(registerdUser);
// });

//All Route
// Route for filtering listings
// Route for filtering listings


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// app.get("/testListing", (req, res) => {
//   let sampleListieng = new Listing({
//     title: "Get Home Villa",
//     description: "this is the nice home for everyone",
//     price: 1200,
//     location: "Merrut,Delhi",
//     country: "India",
//   });
//   sampleListieng
//     .save()
//     .then((res) => {
//       console.log("data is saved");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   res.send("sample was saved");
// });

app.all("*", (req, res, next) => {
  next(new ExpressError(400, "page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { err });
});

// app.use((err, req, res, next) => {
//   console.error(err);
//   res.send("Something went wrong");
// });

app.listen(8080, () => {
  console.log("server is going listieng");
});
