const Joi = require("joi");
module.exports.listingSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).allow(""),
  image: Joi.string().uri().allow(""),
  price: Joi.number().positive().required(),
  location: Joi.string().min(2).max(100).required(),
  country: Joi.string().min(2).max(100).required(),
});

