const Joi = require('joi');

const productSchema = Joi.object({
  title: Joi.string().required().min(5).max(100),
  description: Joi.string().required().max(500),
  price: Joi.number().min(0),
  location: Joi.string().required(),
  country: Joi.string().required(),
  image: Joi.object({
    filename: Joi.string().optional().max(10).allow("",null),
    url: Joi.string().optional().allow("",null),
  }).optional(),
});

module.exports = productSchema;  // Correct export
