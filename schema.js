const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    country: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
    category: Joi.string().required(),
  }).required(),
});
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});

// if i send this type of module.exports then we require directly object in another folder
// const listingSchema = require("./schema.js");

// const listingSchema = Joi.object({
//   listing: Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     country: Joi.string().required(),
//     location: Joi.string().required(),
//     price: Joi.number().required().min(0),
//     image: Joi.string().allow("", null),
//   }).required(),
// });
// module.exports = listingSchema;
// Joi allows the developers to build the Javascript blueprints and make sure that the application accepts the accurately formatted data.