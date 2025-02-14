const { appLogger } = require("../utils/logger");
const { createErrorResponse } = require("../utils/createResponse"); // Import the function
const {
  BadRequestError,
  InternalServerError,
  GatewayTimeoutError,
} = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  const status = err.isJoi ? 400 : err.httpStatus || 500;
  const message = err.message || "server error";

  // Log the error
  appLogger.error(`Error: ${message}`, { error: err });

  // Send the error response using createErrorResponse
  const errorResponse = createErrorResponse(status, message);
  res.status(status).json(errorResponse);
};

module.exports = errorHandler;
