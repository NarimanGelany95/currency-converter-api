const { getExchangeRate } = require("../src/services/exchangeRateService");
const axios = require("axios");
const {
  BadRequestError,
  InternalServerError,
  GatewayTimeoutError,
} = require("../src/utils/errors");

// Mock axios
jest.mock("axios");

describe("getExchangeRate", () => {
  const req = { originalUrl: "/api/convert", user: { id: "12345" } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the exchange rate for valid currencies", async () => {
    const mockResponse = {
      data: {
        conversion_rates: {
          EUR: 0.85,
        },
      },
    };
    axios.get.mockResolvedValue(mockResponse);

    const rate = await getExchangeRate(req, "USD", "EUR");
    expect(rate).toBe(0.85);
    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.EXCHANGE_RATE_API_URL}${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`,
      { timeout: process.env.REQUEST_TIMEOUT }
    );
  });

  it("should throw BadRequestError for invalid target currency", async () => {
    const mockResponse = {
      data: {
        conversion_rates: {},
      },
    };
    axios.get.mockResolvedValue(mockResponse);

    await expect(getExchangeRate(req, "USD", "INVALID")).rejects.toThrow(
      BadRequestError
    );
  });

  it("should throw GatewayTimeoutError on request timeout", async () => {
    axios.get.mockRejectedValue({ code: "ECONNABORTED" });

    await expect(getExchangeRate(req, "USD", "EUR")).rejects.toThrow(
      GatewayTimeoutError
    );
  });

  it("should throw InternalServerError on unexpected errors", async () => {
    axios.get.mockRejectedValue(new Error("Unexpected error"));

    await expect(getExchangeRate(req, "USD", "EUR")).rejects.toThrow(
      InternalServerError
    );
  });
});
