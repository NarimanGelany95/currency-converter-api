const Errors = require("../utils/errors");
const { createErrorResponse } = require("../utils/createResponse");

const validateJoi =
  (schema, location = "body") =>
  (req, res, next) => {
    try {
      const { error } = schema.validate(req[location], { abortEarly: false });
      if (error) {
        const errorMessage = error.details.map((err) => err.message).join(", ");
        const errorResponse = createErrorResponse(400, errorMessage);
        return res.status(400).json(errorResponse);
      }
      next();
    } catch (err) {
      const errorResponse = createErrorResponse(
        500,
        "Unexpected error during validation"
      );
      return res.status(500).json(errorResponse);
    }
  };

module.exports = validateJoi;
