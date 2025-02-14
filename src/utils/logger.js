const fs = require("fs");
const bunyan = require("bunyan");
const config = require("../config/config");
const logDir = "logs";
// Ensure the logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
class Logger {
  constructor(name, streams) {
    this.logger = bunyan.createLogger({
      name,
      level: config.logLevel,
      serializers: bunyan.stdSerializers,
      src: false,
      streams,
    });
  }

  getLogger() {
    return this.logger;
  }
}

const createLogger = (name, logPath) =>
  new Logger(name, [
    {
      level: "info",
      path: `${logPath}/info.log`,
    },
    {
      level: "error",
      path: `${logPath}/error.log`,
    },
  ]).getLogger();

const appLogger = createLogger(config.baseUrl, "logs");
const auditLogger = createLogger(config.baseUrl, "audits");

module.exports = { appLogger, auditLogger };
