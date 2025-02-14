const authMiddleware = require("../src/middlewares/authMiddleware");
const { verifyToken } = require("../src/utils/jwt");
const { createErrorResponse } = require("../src/utils/createResponse");

jest.mock("../src/utils/jwt", () => ({
  verifyToken: jest.fn(),
}));

jest.mock("../src/utils/createResponse", () => ({
  createErrorResponse: jest.fn((status, message) => ({
    status,
    data: { message },
  })),
}));

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 401 if no token is provided", () => {
    req.header.mockReturnValue(null); // No token

    authMiddleware(req, res, next);

    expect(createErrorResponse).toHaveBeenCalledWith(
      401,
      "Access denied. No token provided."
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 401,
      data: { message: "Access denied. No token provided." },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if the token is invalid", () => {
    req.header.mockReturnValue("Bearer invalid-token");
    verifyToken.mockImplementation(() => {
      throw new Error("Invalid or expired token");
    });

    authMiddleware(req, res, next);

    expect(createErrorResponse).toHaveBeenCalledWith(
      401,
      "Invalid or expired token"
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 401,
      data: { message: "Invalid or expired token" },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() and attach user to req if token is valid", () => {
    req.header.mockReturnValue("Bearer valid-token");
    const mockUser = { id: "user-id", name: "John Doe" };
    verifyToken.mockReturnValue(mockUser);

    authMiddleware(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith("valid-token");
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });
});
