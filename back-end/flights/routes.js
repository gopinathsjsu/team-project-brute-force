"use strict";
const express = require("express");
const Joi = require("joi");
const { Op } = require("sequelize");
const { requireSignIn } = require("../configuration/passport");
const { verifyCustomer } = require("../helpers/authorization");
const models = require("../models/model_relations");

// Initializing Router
const router = express.Router();

// Get Flight Details
router.get("/details/:flightNumber", requireSignIn, verifyCustomer, async (req, res) => {
    const flight = await models.flights.findByPk(req.params.flightNumber);
    if (!flight || flight == null) {
        res.status(400).send({ message: "Flight does not exist!" });
        return;
    }
    res.status(200).send({ flight });
    return;
});

module.exports = router;