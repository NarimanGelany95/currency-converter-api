const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const currencyRoutes = require("./src/routes/currencyRoutes");
const authRoutes = require("./src/routes/authRoutes");
const errorHandler = require("./src/middlewares/errorHandler");
const config = require("./src/config/config");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const loggerMiddleware = require("./src/middlewares/loggerMiddleware");

// Load environment variables
dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

const { port, baseUrl } = config;
const app = express();

// Middleware
app.use(loggerMiddleware);
app.use(express.json());

app.use(cors());
app.use(helmet());

// Swagger setup
const swaggerDocument = YAML.load(path.join(__dirname, "public/swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", currencyRoutes);

// Error-handling middleware
app.use(errorHandler);

// Export the app for testing
module.exports = app;

// Start the server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Base URL: http://localhost:${port}/${baseUrl}`);
    console.log(`Auth URL: http://localhost:${port}/${baseUrl}/auth`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}
