require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  baseUrl: process.env.BASE_URL || "api",
  // Logging Configuration
  logLevel: process.env.LOG_LEVEL || "info",

  // Exchange Rate API Configuration
  exchangeRateAPI: {
    baseURL:
      process.env.EXCHANGE_RATE_API_BASE_URL ||
      "https://api.exchangerate-api.com/v4/latest/",
    key: process.env.EXCHANGE_RATE_API_KEY || "your-api-key-here",
  },
};

module.exports = config;
