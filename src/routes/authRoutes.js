const express = require("express");
require("dotenv").config();
const auth = require("basic-auth");
const { generateToken } = require("../utils/jwt");
const {
  createSuccessResponse,
  createErrorResponse,
} = require("../utils/createResponse");
const methodNotAllowed = require("../middlewares/methodNotAllowed");
const { appLogger } = require("../utils/logger");
const router = express.Router();

// Hardcoded username and password
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const USER_ID = process.env.USER_ID;

// Login and generate JWT
router.post("/login", async (req, res) => {
  try {
    // Extract username and password from Basic Auth header
    const credentials = auth(req);

    if (!credentials || !credentials.name || !credentials.pass) {
      appLogger.warn(
        `Login attempt with invalid credentials for user: ${
          credentials?.name || "unknown"
        }`
      );
      const errorResponse = createErrorResponse(
        401,
        "Unauthorized - invalid credentials"
      );
      return res.status(401).json(errorResponse);
    }

    const { name: username, pass: password } = credentials;

    // Check if the provided credentials match the fixed username and password
    if (username !== USERNAME || password !== PASSWORD) {
      const errorResponse = createErrorResponse(
        401,
        "Unauthorized - invalid credentials"
      );
      return res.status(401).json(errorResponse);
    }

    // Generate a JWT token with user ID
    const token = generateToken(USER_ID);
    appLogger.info(`User ${username} logged in successfully`);
    const successResponse = createSuccessResponse({
      token,
    });
    res.json(successResponse);
  } catch (error) {
    const errorResponse = createErrorResponse(400, error.message);
    res.status(400).json(errorResponse);
  }
});

router.all("/login", methodNotAllowed);

module.exports = router;
