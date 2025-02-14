const request = require("supertest");
const app = require("../server");
require("dotenv").config();

beforeAll(() => {
  const PORT = process.env.PORT || 3000;
  server = app.listen(PORT);
});
afterAll(() => {
  server.close();
});
describe("POST /api/auth/login", () => {
  // Test successful login
  it("should return a JWT token for valid credentials", async () => {
    const credentials = Buffer.from(
      `${process.env.USERNAME}:${process.env.PASSWORD}`
    ).toString("base64");

    const response = await request(app)
      .post("/api/auth/login")
      .set("Authorization", `Basic ${credentials}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.token");
    expect(response.body.data.token).toBeTruthy();
  });

  // Test invalid credentials
  it("should return a 401 error for invalid credentials", async () => {
    const credentials = Buffer.from("wrongusername:wrongpassword").toString(
      "base64"
    );

    const response = await request(app)
      .post("/api/auth/login")
      .set("Authorization", `Basic ${credentials}`)
      .expect(401);

    expect(response.body).toHaveProperty("data.message");
    expect(response.body.data.message).toBe(
      "Unauthorized - invalid credentials"
    );
  });

  // Test missing credentials
  it("should return a 401 error for missing credentials", async () => {
    const response = await request(app).post("/api/auth/login").expect(401);
    expect(response.body).toHaveProperty("data.message");
    expect(response.body.data.message).toBe(
      "Unauthorized - invalid credentials"
    );
  });
});
