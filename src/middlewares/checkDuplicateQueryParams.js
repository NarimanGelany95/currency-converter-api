const { createErrorResponse } = require("../utils/createResponse");

const checkDuplicateQueryParams = (req, res, next) => {
  const queryParams = Object.keys(req.query);

  // Check for duplicate parameters
  const duplicateParams = queryParams.filter((param) =>
    Array.isArray(req.query[param])
  );

  if (duplicateParams.length > 0) {
    const errorMessage = `Duplicate query parameters found: ${duplicateParams.join(
      ", "
    )}`;
    const errorResponse = createErrorResponse(400, errorMessage);
    return res.status(400).json(errorResponse);
  }

  next();
};

module.exports = checkDuplicateQueryParams;
