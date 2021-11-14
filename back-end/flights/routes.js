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

// Search Flights
router.post("/search", requireSignIn, verifyCustomer, async (req, res) => {

    const schema = Joi.object({
        source: Joi.string().required().max(3).regex(/^[A-Z]*$/).messages({
            "any.required": "Enter a valid source",
            "string.empty": "Enter a valid source",
            "string.pattern.base": "Enter a valid source",
            "string.max": "Length of the airport code should not exceed 3 characters"
        }),
        destination: Joi.string().required().max(3).regex(/^[A-Z]*$/).messages({
            "any.required": "Enter a valid source",
            "string.empty": "Enter a valid source",
            "string.pattern.base": "Enter a valid source",
            "string.max": "Length of the airport code should not exceed 3 characters"
        }),
        departureTime: Joi.string().required().empty().messages({
            "any.required": "Enter a valid departure date",
            "string.empty": "Enter a valid arrival date",
        }),
    });

    // validate schema
    const result = await schema.validate(req.body);

    if (result.error) {
        res.status(400).send({ message: result.error.details[0].message });
        return;
    }

    const flights = await models.flights.findAll(
        {
            where: {
                source: req.body.source,
                destination: req.body.destination,
                departureTime: {
                    [Op.gte]: date,
                    [Op.lte]: dateNextDay
                },
                seatsLeft: {
                    [Op.gte]: 1
                }
            },
            order: [["price", "ASC"], ["seatsLeft", "DESC"]],
        }
    );

    console.log(flights);

    res.status(200).send({ flights, message: "Flights fetched successfully" });
    return;

});


module.exports = router;