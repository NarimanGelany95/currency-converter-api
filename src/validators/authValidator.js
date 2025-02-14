const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().required().messages({
    "any.required": `"Unauthorized - invalid credentials`,
  }),
  password: Joi.string().required().messages({
    "any.required": `"Unauthorized - invalid credentials`,
  }),
});

module.exports = { loginSchema };
