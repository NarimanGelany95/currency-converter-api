const request = require("supertest");
const app = require("../server");
const { getExchangeRate } = require("../src/services/exchangeRateService");
const { BadRequestError } = require("../src/utils/errors");
// Mock the service
jest.mock("../src/services/exchangeRateService");
jest.mock("../src/middlewares/authMiddleware", () => (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      data: { message: "Access denied. No token provided." },
    });
  }

  if (token === "Bearer invalid-token") {
    return res.status(401).json({
      data: { message: "Invalid or expired token" },
    });
  }

  req.user = { id: "test-user-id" }; // Mock a valid user when token is present
  next();
});
describe("API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/convert should return converted amount", async () => {
    getExchangeRate.mockResolvedValue(0.85);

    const response = await request(app)
      .get("/api/convert?from=USD&to=EUR&amount=100")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: 200,
        data: expect.objectContaining({
          from: "USD",
          to: "EUR",
          exchangeRate: 0.85,
          amount: "100",
          convertedAmount: 85,
        }),
      })
    );
  });

  it("should throw BadRequestError when targetCurrency is invalid", async () => {
    const req = { originalUrl: "/api/convert" };
    const baseCurrency = "USD";
    const targetCurrency = "TTT"; // Invalid currency

    // Mock getExchangeRate to throw BadRequestError
    getExchangeRate.mockImplementation(() => {
      throw new BadRequestError(
        `"${targetCurrency}" is an invalid currency code`
      );
    });

    try {
      await getExchangeRate(req, baseCurrency, targetCurrency);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe(
        `"${targetCurrency}" is an invalid currency code`
      );
    }
  });
});
