const { appLogger, auditLogger } = require("../utils/logger");

const loggerMiddleware = (req, _res, next) => {
  req.logger = appLogger;
  req.auditLogger = auditLogger;
  next();
};

module.exports = loggerMiddleware;
