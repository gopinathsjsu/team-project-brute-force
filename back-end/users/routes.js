"use strict";
const express = require("express");
const bcrypt = require("bcrypt");
const models = require("../models/model_relations");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const configuration = require("../helpers/data");
const { capitalizeFirstLetter } = require("../helpers/utils");
// Initializing Router
const router = express.Router();

// SignUp Route
/**
 * @swagger
 * /users/signup:
 *  post:
 *      description: User SignUp route
 *  
 */
router.post("/signup", async (req, res) => {

    // Creating schema for validating input
    const schema = Joi.object({
        firstName: Joi.string()
            .required()
            .max(64)
            .regex(/^[a-zA-Z ]*$/)
            .messages({
                "any.required": "Enter a valid name.",
                "string.empty": "Enter a valid name.",
                "string.pattern.base": "Enter a valid name",
                "string.max": "Length of the name should not exceed 64 characters",
            }),
        lastName: Joi.string()
            .required()
            .max(64)
            .regex(/^[a-zA-Z ]*$/)
            .messages({
                "any.required": "Enter a valid name.",
                "string.empty": "Enter a valid name.",
                "string.pattern.base": "Enter a valid name",
                "string.max": "Length of the name should not exceed 64 characters",
            }),
        email: Joi.string()
            .email({
                minDomainSegments: 2,
                tlds: { allow: ["com", "net"] },
            })
            .required()
            .messages({
                "string.email": "Enter a valid email.",
                "string.empty": "Enter a valid email.",
                "any.required": "Email is required.",
            }),
        password: Joi.string().required().messages({
            "string.empty": "Password is required.",
            "any.required": "Password cannot be empty",
        }),
        gender: Joi.string().valid(configuration.MALE, configuration.FEMALE, configuration.OTHER).required().messages({
            "any.required": "Gender cannot be empty",
            "string.valid": "Choose a valid gender"
        }),
    });

    // Validating schema for the input fields
    const result = await schema.validate(req.body);
    if (result.error) {
        res.status(400).send({ errorMessage: result.error.details[0].message });
        return;
    }

    let createdUser;
    const role = req.body.email.split('@')[1] === process.env.DOMAIN_NAME ? configuration.ADMIN : configuration.CUSTOMER;
    const hashedPassword = await bcrypt.hash(req.body.password, await bcrypt.genSalt());

    try {
        createdUser = await models.users.create({
            firstName: capitalizeFirstLetter(req.body.firstName),
            lastName: capitalizeFirstLetter(req.body.lastName),
            email: req.body.email,
            password: hashedPassword,
            gender: req.body.gender,
            role,
        }, {
            fields: ["firstName", "lastName", "email", "password", "gender", "role"]
        });

        const jwtToken = jwt.sign({
            id: createdUser.id,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            email: createdUser.email,
            role: createdUser.role,
            miles: createdUser.miles,
        }, process.env.SECRET_KEY);

        res.status(200).send({
            user: {
                id: createdUser.id,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName,
                email: createdUser.email.toLowerCase(),
                role: createdUser.role,
                miles: createdUser.miles,
            },
            token: jwtToken,
            message: "Signed Up Successfully."

        });

    } catch (error) {
        if (error.name === configuration.UNIQUE_ERROR_NAME) {
            res.status(400).send({
                message: "Account belonging to this email already exists.",
            });
        } else {
            console.log(error);
            res.status(400).send({ error });
        }
    }
});

router.post("/login", async (req, res) => {

    // Creating a schema for validating input fields
    const schema = Joi.object({
        email: Joi.string()
            .email({
                minDomainSegments: 2,
                tlds: { allow: ["com", "net"] },
            })
            .required()
            .messages({
                "string.email": "Enter a valid email.",
                "string.empty": "Enter a valid email.",
                "any.required": "Email is required.",
            }),
        password: Joi.string().required().messages({
            "string.empty": "Password is required.",
            "any.required": "Password cannot be empty.",
        }),
    });

    // Validate the input fields
    const result = await schema.validate(req.body);

    if (result.error) {
        res.status(400).send({ errorMessage: result.error.details[0].message });
        return;
    }

    // Check if the user with the input email exists
    const loggedInUser = await models.users.findOne({
        where: {
            email: req.body.email.toLowerCase()
        }
    });

    if (loggedInUser == null || !(await bcrypt.compare(req.body.password, loggedInUser.password))) {
        res.status(401).send({ message: "Invalid email or password" });
    } else {
        const user = {
            id: loggedInUser.id,
            firstName: loggedInUser.firstName,
            lastName: loggedInUser.lastName,
            email: loggedInUser.email,
            gender: loggedInUser.gender,
            role: loggedInUser.role,
            miles: loggedInUser.miles,
        };

        const jwtToken = jwt.sign(user, process.env.SECRET_KEY);
        res.status(200).send({
            user,
            token: jwtToken,
            message: "Logged In Successfully"
        });
    }
});

module.exports = router;