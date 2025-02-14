const { createErrorResponse } = require("../utils/createResponse");

const methodNotAllowed = (req, res, next) => {
  const errorMessage = `Method ${req.method} is not allowed for ${req.originalUrl}`;
  const errorResponse = createErrorResponse(405, errorMessage);

  res.status(405).json(errorResponse);
};

module.exports = methodNotAllowed;
