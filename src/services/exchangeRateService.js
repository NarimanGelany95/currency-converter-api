// src/services/exchangeRateService.js
const axios = require("axios");
const {
  BadRequestError,
  InternalServerError,
  GatewayTimeoutError,
} = require("../utils/errors");
const { appLogger, auditLogger } = require("../utils/logger");
const createAudit = require("../utils/createAudit");

const BASE_URL = process.env.EXCHANGE_RATE_API_URL;
const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const REQUEST_TIMEOUT = process.env.REQUEST_TIMEOUT;

const getExchangeRate = async (req, baseCurrency, targetCurrency) => {
  try {
    appLogger.info(
      `Fetching exchange rate for ${baseCurrency} to ${targetCurrency}`
    );

    const response = await axios.get(
      `${BASE_URL}${API_KEY}/latest/${baseCurrency}`,
      {
        timeout: REQUEST_TIMEOUT,
      }
    );

    const rate = response.data.conversion_rates[targetCurrency];

    if (!rate) {
      const errorMessage = `"${targetCurrency}" is an invalid currency code`;
      appLogger.warn(errorMessage);
      createAudit(auditLogger, req.originalUrl, errorMessage, false, {
        baseCurrency,
        targetCurrency,
      });

      throw new BadRequestError(errorMessage);
    }

    appLogger.info(
      `Exchange rate found: 1 ${baseCurrency} = ${rate} ${targetCurrency}`
    );

    createAudit(
      auditLogger,
      req.originalUrl,
      "Exchange rate fetched successfully",
      true,
      {
        baseCurrency,
        targetCurrency,
        rate,
      }
    );

    return rate;
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error; // Rethrow BadRequestError
    }
    if (error.response) {
      const { status, data } = error.response;
      if (data && data["error-type"] === "unsupported-code") {
        const errorMessage = `"${baseCurrency}" is an invalid currency code`;
        appLogger.warn(errorMessage);

        createAudit(auditLogger, req.originalUrl, errorMessage, false, {
          baseCurrency,
          targetCurrency,
        });

        throw new BadRequestError(errorMessage);
      }

      appLogger.error(`API error ${status}: ${data.error || "Unknown error"}`);

      createAudit(auditLogger, req.originalUrl, `API error ${status}`, false, {
        baseCurrency,
        targetCurrency,
        error: data.error || "Unknown error",
      });

      throw new InternalServerError(
        `API error ${status}: ${data.error || "Unknown error"}`
      );
    } else if (error.code === "ECONNABORTED") {
      const errorMessage = "Request to the exchange rate API timed out";
      appLogger.error(errorMessage);

      createAudit(auditLogger, req.originalUrl, errorMessage, false, {
        baseCurrency,
        targetCurrency,
        error: error.message,
      });

      throw new GatewayTimeoutError(errorMessage);
    } else {
      appLogger.error(`Unexpected error: ${error.message}`);

      createAudit(auditLogger, req.originalUrl, "Unexpected error", false, {
        baseCurrency,
        targetCurrency,
        error: error.message,
      });

      throw new InternalServerError("Unexpected error occurred");
    }
  }
};

module.exports = { getExchangeRate };
