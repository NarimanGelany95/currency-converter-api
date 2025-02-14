const createAudit = (auditLogger, url, message, success, attributes) => {
  const logData = {
    url,
    requestId: "requestId",
    message,
    attributes: { ...attributes },
  };

  if (success) {
    auditLogger.info(logData);
  } else {
    auditLogger.error(logData);
  }
};

module.exports = createAudit;
