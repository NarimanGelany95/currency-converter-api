const express = require("express");
const { convertCurrency } = require("../controllers/currencyController");
const validateJoi = require("../middlewares/validateJoi");
const { currencyConversionSchema } = require("../validators/currencyValidator");
const methodNotAllowed = require("../middlewares/methodNotAllowed");
const checkDuplicateQueryParams = require("../middlewares/checkDuplicateQueryParams");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/convert")
  .get(
    authMiddleware, // Middleware to authenticate the request ( check for a valid JWT token)
    checkDuplicateQueryParams, // Middleware to check for duplicate query parameters in the request
    validateJoi(currencyConversionSchema, "query"), // Middleware to validate the query parameters using the Joi schema
    convertCurrency // Controller function to handle the currency conversion logic
  )
  .all(methodNotAllowed);

module.exports = router;
