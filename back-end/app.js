"use strict";

// imports
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const passport = require("passport");
const session = require("express-session");
require('custom-env').env(true);

const { initializePassport } = require("./configuration/passport");

// port number
const PORT = process.env.PORT || 3001;

// Import Routes
const usersRoutes = require("./users/routes");
const adminRoutes = require("./admin/routes");
const masterRoutes = require("./masters/routes");
const flightRoutes = require("./flights/routes");
const reservationRoutes = require("./reservations/routes");

// Swagger Config
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Airline Reservation APIs",
            description: "APIs Documentation",
            contact: {
                name: "Monil Sakhidas"
            },
            servers: [process.env.BACKEND_URL],
        }
    },
    apis: ["app.js", "users/*.js"]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: process.env.SECRET_KEY }));
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Using Passport for authentication
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Cache-Control", "no-cache");
    next();
});

// Swagger API Documentation Url
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/**
 * @swagger
 * /health:
 *  get:
 *      description: Check Status of backend
 *      responses:
 *          '200':
 *              description: 'A health Check'
 */
app.get("/health", (req, res) => {
    return res.status(200).send({ "message": "It works!" });
});

// Add Routes

app.use("/users", usersRoutes);
app.use("/admin", adminRoutes);
app.use("/masters", masterRoutes);
app.use("/flights", flightRoutes);
app.use("/reservations", reservationRoutes);

app.listen(PORT, () => {
    console.log("Server listening on port: ", PORT);
});
