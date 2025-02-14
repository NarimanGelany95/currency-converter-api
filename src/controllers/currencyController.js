const { getExchangeRate } = require("../services/exchangeRateService");
const { createSuccessResponse } = require("../utils/createResponse");
const { appLogger, auditLogger } = require("../utils/logger");
const createAudit = require("../utils/createAudit");

const convertCurrency = async (req, res, next) => {
  const { from, to, amount } = req.query;

  appLogger.info(`Authenticated user ID: ${req.user.id}`);
  appLogger.info(`Received request to convert ${amount} ${from} to ${to}`);

  try {
    const rate = await getExchangeRate(
      req,
      from.toUpperCase(),
      to.toUpperCase()
    );

    if (!rate) {
      const errorMessage = `Exchange rate not found for ${from} to ${to}`;
      appLogger.warn(errorMessage);

      createAudit(auditLogger, req.originalUrl, errorMessage, false, {
        from,
        to,
        amount,
      });

      const error = new Error(errorMessage);
      error.httpStatus = 404;
      throw error; // Throw the error to be caught by the catch block
    }

    const convertedAmount = parseFloat(amount) * rate;

    const successResponse = createSuccessResponse({
      from,
      to,
      exchangeRate: rate,
      amount,
      convertedAmount,
    });

    appLogger.info(
      `Converted ${amount} ${from} to ${convertedAmount} ${to} at rate ${rate}`
    );

    createAudit(
      auditLogger,
      req.originalUrl,
      "Currency conversion successful",
      true,
      {
        from,
        to,
        amount,
        convertedAmount,
        exchangeRate: rate,
      }
    );

    return res.json(successResponse);
  } catch (error) {
    appLogger.error(`Error during conversion: ${error.message}`, { error });

    createAudit(
      auditLogger,
      req.originalUrl,
      "Currency conversion failed",
      false,
      {
        from,
        to,
        amount,
        error: error.message,
      }
    );

    next(error);
  }
};

module.exports = { convertCurrency };
