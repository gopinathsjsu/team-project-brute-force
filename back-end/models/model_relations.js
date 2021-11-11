"use strict";

const Sequelize = require("sequelize");
const db = require("../configuration/database");

const models = {};

// Importing all the models
models.users = require("../models/user")(Sequelize, db);
models.reservations = require("../models/reservation")(Sequelize, db);
models.flights = require("../models/flight")(Sequelize, db);

// A flight is createdBy a user
models.flights.belongsTo(models.users, { foreignKey: "createdBy" });

// A Reservation has one customer associated with it
models.reservations.belongsTo(models.users, { foreignKey: "customer" });
// A Reservations contains many flights
models.reservations.belongsTo(models.flights, { foreignKey: "flightNumber" });

module.exports = models;

