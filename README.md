# **NodeJS CUrrency Converter Backend API**

## **Technologies Used**

1. Node.js: A JavaScript runtime for building scalable backend applications.

2. Express: A web framework for Node.js used to build RESTful APIs.

3. Axios: A promise-based HTTP client for making API requests.

4. JWT (JSON Web Tokens): For user authentication and authorization.

5. Joi: For request validation.

6. Dotenv: For managing environment variables.

7. Winston: For logging.

8. Jest: For unit and integration testing.

9. Supertest: For testing HTTP endpoints.

## **Prerequisites**

- Git: For version control.
- NodeJS: Version 16 or later.
- NPM: Node Package Manager (comes with Node.js).
- CLI: Command Line Interface for running commands.

To verify your installations, run:

```sh
$ npm -v && node -v
v 10.9.2
v 22.13.1
```

## **Getting Started**

Follow these steps to set up the project on your local machine.

1. Clone the Repository

```sh
$ git clone https://github.com/NarimanGelany95/currency-converter-api.git
$ cd currency-converter-api
```

2. Install Dependencies

Install the required dependencies using npm:

```sh
$ node --version
$ npm install
```

## **Usage**

### Serving the app

To start the server, run:

```sh
$ npm start
```

The API will be available at http://localhost:3000.

### Running the tests

To run the unit and integration tests, use:

```sh
$ npm test
```

## **API Endpoints**

### Authentication

- POST /api/auth/login

        - Authenticate a user and generate a JWT token.
          Authorization:
              "username": "your_username",
              "password": "your_password"
          Response:
          ```json
          {
      "status": 200,
      "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....."
      },
      "info": {
          "timestamp": "2025-02-13T11:41:09.432Z",
          "version": "1.0.0"
      }

  }

  ```

  ```

### Currency Conversion

- GET /api/convert

  - Convert an amount from one currency to another.
  - Query Parameters:
    from: The base currency code (e.g., USD).
    to: The target currency code (e.g., EUR).
    amount: The amount to convert.

        Response:
         ```json
            {
        "status": 200,
        "data": {
            "from": "EGP",
            "to": "EUR",
            "exchangeRate": 0.01904,
            "amount": "32",
            "convertedAmount": 0.60928
        },
        "info": {
            "timestamp": "2025-02-13T21:00:50.241Z",
            "version": "1.0.0"
        }

    }

    ```

    ```

## Logging

The application uses Winston for logging. Logs are stored in the logs/ directory and include:

Application logs: General application events.

Audit logs: Record of API requests and responses.
