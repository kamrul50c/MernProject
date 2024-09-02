const Joi = require('joi');

const userschema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(), // Added email validation
  password: Joi.string().required()
});

module.exports = userschema;
