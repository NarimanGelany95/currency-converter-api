const { convertCurrency } = require("../src/controllers/currencyController");
const { getExchangeRate } = require("../src/services/exchangeRateService");
const { createSuccessResponse } = require("../src/utils/createResponse");

// Mock the service
jest.mock("../src/services/exchangeRateService");

describe("convertCurrency", () => {
  const req = {
    query: { from: "USD", to: "EUR", amount: "100" },
    user: { id: "12345" },
    originalUrl: "/api/convert",
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return converted amount for valid input", async () => {
    getExchangeRate.mockResolvedValue(0.85);

    await convertCurrency(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect.objectContaining({
      status: 200,
      data: expect.objectContaining({
        from: "USD",
        to: "EUR",
        exchangeRate: 0.85,
        amount: "100",
        convertedAmount: 85,
      }),
    });
  });

  it("should handle errors and pass them to next", async () => {
    const error = new Error("Test error");
    error.httpStatus = 400;
    getExchangeRate.mockRejectedValue(error);

    await convertCurrency(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
