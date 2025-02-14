const { verifyToken } = require("../utils/jwt");
const { createErrorResponse } = require("../utils/createResponse");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    const errorResponse = createErrorResponse(
      401,
      "Access denied. No token provided."
    );
    return res.status(401).json(errorResponse);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach the decoded user to the request object
    next();
  } catch (error) {
    const errorResponse = createErrorResponse(401, "Invalid or expired token");
    res.status(401).json(errorResponse);
  }
};

module.exports = authMiddleware;
