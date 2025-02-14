const createResponse = (status, data = null) => {
  return {
    status,
    data,
    info: {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    },
  };
};

const createSuccessResponse = (data = null) => {
  return createResponse(200, data);
};

const createErrorResponse = (status, message) => {
  return createResponse(status, { message });
};

module.exports = { createSuccessResponse, createErrorResponse };
