const request = require("supertest");
const express = require("express");
const errorMiddleware = require("../src/middlewares/errorHandler");

// Create a test app
const app = express();

// Add a route that throws an error without a message
app.get("/server-error", (req, res, next) => {
  const error = new Error();
  error.httpStatus = 500;
  next(error);
});

// Use the error handler middleware
app.use(errorMiddleware);

describe("Error Handling Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 400 if the error is from Joi validation", () => {
    const err = { isJoi: true, message: "Validation error" };

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 400,
      data: {
        message: "Validation error",
      },
      info: {
        timestamp: expect.any(String), // Dynamic timestamp
        version: "1.0.0",
      },
    });
  });

  it("should return the correct HTTP status if err.httpStatus is set", () => {
    const err = { httpStatus: 403, message: "Forbidden access" };

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      status: 403,
      data: {
        message: "Forbidden access",
      },
      info: {
        timestamp: expect.any(String), // Dynamic timestamp
        version: "1.0.0",
      },
    });
  });

  it("should return 500 if no httpStatus is provided", () => {
    const err = { message: "Something went wrong" };

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      data: {
        message: "Something went wrong",
      },
      info: {
        timestamp: expect.any(String), // Dynamic timestamp
        version: "1.0.0",
      },
    });
  });

  it("should return 'server error' if no message is provided", async () => {
    const response = await request(app).get("/server-error");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: 500,
      data: {
        message: "server error",
      },
      info: {
        timestamp: expect.any(String), // Dynamic timestamp
        version: "1.0.0",
      },
    });
  });
});
