"use strict";

const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const models = require("../models/model_relations");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
};

const initializePassport = () => {
    passport.use(
        new JwtStrategy(options, (decodedPayload, callback) => {
            console.log(decodedPayload);
            const userId = decodedPayload.id;
            models.users.findByPk(userId, { attributes: ['id', 'firstName', 'lastName', 'role', 'email', 'gender'] }).then((user) => {
                if (user) {
                    callback(null, user);
                } else {
                    callback(null, false);
                }
            }).catch((error) => {
                console.log(error);
                return callback(error, false);
            });
        })
    );
};

const requireSignIn = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (error, user, info) => {
        if (error || !user) {
            console.log(error);
            const message = {
                message: "Please login to continue",
            };
            return res.status(401).json(message);
        } else {
            req.user = user;
        }
        return next();
    })(req, res, next);
};

module.exports = {
    initializePassport,
    requireSignIn
};