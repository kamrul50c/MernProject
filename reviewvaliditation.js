const Joi = require('joi');

const revewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  comment: Joi.string().required().max(256)
});

module.exports = revewSchema;


