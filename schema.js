const Joi = require("joi");
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).allow(""),
    image: Joi.string().uri().allow(""),
    price: Joi.number().positive().required(),
    location: Joi.string().min(2).max(100).required(),
    country: Joi.string().min(2).max(100).required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().trim().required(),

    rating: Joi.number().min(1).max(5).required(),

    createdAt: Joi.date().default(() => new Date()),
  }).required(),
});
