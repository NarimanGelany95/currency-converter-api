const jwt = require("jsonwebtoken");

// Generate a JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    throw new Error("Invalid or expired token");
  }
};
module.exports = { verifyToken, generateToken };
