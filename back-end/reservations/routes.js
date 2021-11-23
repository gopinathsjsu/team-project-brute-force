"use strict";
const express = require("express");
const Joi = require("joi");
const { requireSignIn } = require("../configuration/passport");
const { verifyCustomer } = require("../helpers/authorization");
const { Op } = require("sequelize");
const models = require("../models/model_relations");
const configuration = require("../helpers/data");

// Initializing Router
const router = express.Router();

// Create Reservation
router.post("/create", requireSignIn, verifyCustomer, async (req, res) => {
    const schema = Joi.object({
        flightNumber: Joi.string().required().empty().min(3).max(6).messages({
            "string.min": "Enter a valid flight number.",
            "string.max": "Enter a valid flight number.",
            "string.empty": "Enter a valid flight number.",
            "any.required": "Enter a valid flight number",
        }),
        quantity: Joi.number().integer().min(1).max(configuration.MAX_TICKETS_THAT_CAN_BE_BOOKED).required().messages({
            "number.min": "Enter a valid quantity.",
            "number.max": "Cannot book more than 20 tickets.",
            "any.required": "Enter a valid quantity.",
        }),
        shouldUseMiles: Joi.number().integer().min(0).max(1).required().messages({
            "number.min": "Enter a valid number (should use miles).",
            "number.max": "Enter a valid number (should use miles).",
            "any.required": "Enter a valid number (should use miles).",
        }),
    });

    // validate schema
    const result = await schema.validate(req.body);

    if (result.error) {
        res.status(400).send({ message: result.error.details[0].message });
        return;
    }

    // Get User
    const user = await models.users.findByPk(req.user.id);

    // Get Flight
    const flight = await models.flights.findByPk(req.body.flightNumber);

    if (!flight || flight == null) {
        res.status(400).send({ message: "Flight does not exist" });
        return;
    }
    else if (flight.seatsLeft < req.body.quantity) {
        res.status(400).send({ message: "Insufficient seats available" });
        return;
    }

    const totalPrice = flight.price * req.body.quantity;
    const milesToBeUsed = (req.body.shouldUseMiles == 1 ? (totalPrice >= user.miles ? user.miles : totalPrice) : 0);
    const effectivePrice = totalPrice - milesToBeUsed;
    const milesToBeAwarded = flight.distance * configuration.REWARDS_RATIO;

    // Create Reservation
    const reservation = await models.reservations.create({
        effectivePrice,
        milesUsed: milesToBeUsed,
        milesAwarded: milesToBeAwarded,
        flightNumber: flight.flightNumber,
        quantity: req.body.quantity,
        customer: user.id,
    });

    flight.seatsLeft -= req.body.quantity;
    const updatedFlight = await flight.save();

    user.miles = user.miles - milesToBeUsed + milesToBeAwarded;
    const updatedUser = await user.save();

    res.status(200).send({
        reservation: {
            id: reservation.id,
            effectivePrice: reservation.effectivePrice,
            milesUsed: reservation.milesUsed,
            milesAwarded: reservation.milesAwarded,
            quantity: reservation.quantity,
            flightNumber: reservation.flightNumber,
            seatsLeft: updatedFlight.seatsLeft,
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            updatedMiles: updatedUser.miles,
        }, message: "Reservation made successfully"
    });
    return;
});

// Get effefctive price
router.get('/effectiveprice', requireSignIn, verifyCustomer, async (req, res) => {
    const schema = Joi.object({
        flightNumber: Joi.string().required().empty().min(3).max(6).messages({
            "string.min": "Enter a valid flight number.",
            "string.max": "Enter a valid flight number.",
            "string.empty": "Enter a valid flight number.",
            "any.required": "Enter a valid flight number",
        }),
        quantity: Joi.number().integer().min(1).max(configuration.MAX_TICKETS_THAT_CAN_BE_BOOKED).required().messages({
            "number.min": "Enter a valid quantity.",
            "number.max": "Cannot book more than 20 tickets.",
            "any.required": "Enter a valid quantity.",
        }),
        shouldUseMiles: Joi.number().integer().min(0).max(1).required().messages({
            "number.min": "Enter a valid number (should use miles).",
            "number.max": "Enter a valid number (should use miles).",
            "any.required": "Enter a valid number (should use miles).",
        }),
    });

    // validate schema
    const result = await schema.validate(req.query);

    if (result.error) {
        res.status(400).send({ message: result.error.details[0].message });
        return;
    }

    // Get User
    const user = await models.users.findByPk(req.user.id);

    // Get Flight
    const flight = await models.flights.findByPk(req.query.flightNumber);

    if (!flight || flight == null) {
        res.status(400).send({ message: "Flight does not exist" });
        return;
    }
    else if (flight.seatsLeft < req.query.quantity) {
        res.status(400).send({ message: "Insufficient seats available" });
        return;
    }

    const totalPrice = flight.price * req.query.quantity;
    const milesToBeUsed = (req.query.shouldUseMiles == 1 ? (totalPrice >= user.miles ? user.miles : totalPrice) : 0);
    const effectivePrice = totalPrice - milesToBeUsed;
    const milesToBeAwarded = flight.distance * configuration.REWARDS_RATIO;

    res.status(200).send({
        milesToBeUsed,
        milesToBeAwarded,
        effectivePrice
    });
});

module.exports = router;