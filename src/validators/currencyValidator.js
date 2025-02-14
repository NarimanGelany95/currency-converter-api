const Joi = require("joi");

const currencyConversionSchema = Joi.object({
  from: Joi.string().length(3).required().messages({
    "string.length": `"from" currency code must be exactly 3 characters`,
    "any.required": `"from" currency is required`,
  }),

  to: Joi.string().length(3).required().messages({
    "string.length": `"to" currency code must be exactly 3 characters`,
    "any.required": `"to" currency is required`,
  }),

  amount: Joi.number()
    .positive()
    .required()
    .empty("") // Disallow empty strings
    .messages({
      "number.base": `"amount" must be a number`,
      "number.positive": `"amount" must be a positive number`,
      "any.required": `"amount" is required`,
      "string.empty": `"amount" is not allowed to be empty`,
    }),
}).custom((value, helpers) => {
  // Check if "from" and "to" are the same
  if (value.from === value.to) {
    return helpers.message(`"from" and "to" currencies cannot be the same`);
  }
  return value; // Return the value if validation passes
});

module.exports = { currencyConversionSchema };
