const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const Mongo_Url = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then((res) => {
    console.log("database is connected");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(Mongo_Url);
}

const initdb = async () => {
  await Listing.deleteMany({});
   initData.data=initData.data.map((obj) => ({ ...obj, owner: "65b3e4aac36bd479099f27c4" }));
  await Listing.insertMany(initData.data);
};

initdb()