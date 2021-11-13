"use strict";
const configuration = require("./data");
const jwt = require("jsonwebtoken");

module.exports = {
    verifyAdmin: (req, res, next) => {
        if (!req.user || !req.user.role || req.user.role !== configuration.ADMIN) {
            res.status(401).send({
                message: "UnAuthorized Access. Only Admins can access this!",
            });
            return;
        }
        next();
        return;
    },
    verifyCustomer: (req, res, next) => {
        if (!req.user || !req.user.role || req.user.role !== configuration.CUSTOMER) {
            res.status(401).send({
                message: "Unauthorized Access. Only Customers can access this!",
            });
            return;
        }
        next();
        return;
    }
};