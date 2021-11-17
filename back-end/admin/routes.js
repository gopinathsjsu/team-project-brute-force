"use strict";
const express = require("express");
const models = require("../models/model_relations");
const Joi = require("joi");
const { requireSignIn } = require("../configuration/passport");
const { verifyAdmin } = require("../helpers/authorization");
const configuration = require("../helpers/data");
const db = require("../configuration/database");
// Initializing Router
const router = express.Router();

// Create Flight
router.post('/createflight', requireSignIn, verifyAdmin, async (req, res) => {
    const schema = Joi.object({
        flightNumber: Joi.number().integer().min(1).max(9999).required().messages({
            "number.min": "Enter a valid flight number.",
            "number.max": "Enter a valid flight number",
            "any.required": "Enter a valid flight number",
        }),
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
        arrivalTime: Joi.string().required().empty().messages({
            "any.required": "Enter a valid departure date",
            "string.empty": "Enter a valid arrival date",
        }),
        price: Joi.number().positive().min(0.01).required().empty().messages({
            "any.required": "Enter a valid price.",
            "number.positive": "Enter a valid price.",
            "number.base": "Enter a valid price.",
            "number.integer": "Enter a valid price."
        }),
        capacity: Joi.number().integer().positive().min(1).required().empty().messages({
            "any.required": "Enter a valid capacity.",
            "number.positive": "Enter a valid capacity.",
            "number.base": "Enter a valid capacity.",
            "number.integer": "Enter a valid capacity."
        }),
        distance: Joi.number().integer().positive().min(1).required().empty().messages({
            "any.required": "Enter a valid distance.",
            "number.positive": "Enter a valid distance.",
            "number.base": "Enter a valid distance.",
            "number.integer": "Enter a valid distance."
        }),
        manufacturer: Joi.string().required().empty().max(64).messages({
            "any.required": "Enter a valid manufacturer name1.",
            "string.empty": "Enter a valid manufacturer name2.",
            "string.max": "Manufacturer name should not exceed 64 characters."
        }),
        model: Joi.string().required().empty().max(64).messages({
            "any.required": "Enter a valid manufacturer model.",
            "string.empty": "Enter a valid manufacturer model.",
            "string.max": "Manufacturer name should not exceed 64 characters."
        })
    });

    // validate schema
    const result = await schema.validate(req.body);

    if (result.error) {
        res.status(400).send({ message: result.error.details[0].message });
        return;
    }

    const currentTime = new Date();
    const departureTime = new Date(req.body.departureTime);
    const arrivalTime = new Date(req.body.arrivalTime);
    if (departureTime == "Invalid Date" || arrivalTime == "Invalid Date" || arrivalTime - departureTime <= 0 || arrivalTime - currentTime <= 0 || departureTime - currentTime <= 0) {
        res.status(400).send({ message: "Enter a valid departure and arrival date." });
        return;
    }

    let flight;

    try {
        flight = await models.flights.create({
            flightNumber: "SA-" + req.body.flightNumber,
            source: req.body.source,
            destination: req.body.destination,
            departureTime: req.body.departureTime,
            arrivalTime: req.body.arrivalTime,
            price: req.body.price,
            capacity: req.body.capacity,
            seatsLeft: req.body.capacity,
            manufacturer: req.body.manufacturer,
            model: req.body.model,
            distance: req.body.distance,
            createdBy: req.user.id,
        });
    } catch (error) {
        if (error.name === configuration.UNIQUE_ERROR_NAME) {
            res.status(400).send({ message: "A Flight with number SA-" + req.body.flightNumber + " already exists!" });
        } else {
            console.log(error);
            res.status(400).send({ message: error }); git;
        }
    }

    res.status(200).send({ flight, message: "Flight created successfully." });
    return;
});

// View My Flights
router.get('/viewmyflights', requireSignIn, verifyAdmin, async (req, res) => {
    const flights = await models.flights.findAll(
        {
            where: { createdBy: req.user.id },
            include: [
                {
                    model: models.users,
                    attributes: ["id", "firstName", "lastName"],
                    required: true,
                    on: {
                        col1: db.where(db.col("user.id"), "=", db.col("createdBy"))
                    }
                }
            ],
            order: [["createdAt", "DESC"]]
        },
    );
    res.status(200).send({ flights, message: "Flights successfully fetched" });
});

// View All Flights
router.get('/viewallflights', requireSignIn, verifyAdmin, async (req, res) => {

    const flights = await models.flights.findAll({
        include: [
            {
                model: models.users,
                attributes: ["id", "firstName", "lastName"],
                required: true,
                on: {
                    col1: db.where(db.col("user.id"), "=", db.col("createdBy"))
                }
            }
        ],
        order: [["createdAt", "DESC"]]
    });
    res.status(200).send({ flights, message: "Flights successfully fetched" });
});

module.exports = router;