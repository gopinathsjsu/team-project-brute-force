"use strict";

module.exports = (Sequelize, db) => {
    const Flight = db.define("flight", {

        flightNumber: {
            type: Sequelize.STRING,
            validate: {
                isFormatOk(value) {
                    if (value.length <= 0 || value.length > 6) {
                        throw new Error("The length of the flight number should be in [0 - 6].");
                    }
                },
            },
            primaryKey: true,
        },

        source: {
            type: Sequelize.STRING(64),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },

        destination: {
            type: Sequelize.STRING(64),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },

        departureTime: {
            type: Sequelize.DATE,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        arrivalTime: {
            type: Sequelize.DATE,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        price: {
            type: Sequelize.DOUBLE,
            allowNull: false,
        },

        capacity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                isZeroOrLesser(value) {
                    if (value <= 0) {
                        throw new Error("Capacity should be a positive number");
                    }
                },
            },
        },

        seatsLeft: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                isZeroOrLesser(value) {
                    if (value <= 0) {
                        throw new Error("Capacity should be a positive number");
                    }
                },
            },
        },

        manufacturer: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
            }
        },

        model: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
            }
        },

        distance: {
            type: Sequelize.BIGINT,
            allowNull: false,
            validate: {
                isZeroOrLesser(value) {
                    if (value <= 0) {
                        throw new Error("Capacity should be a positive number");
                    }
                },
            }
        },

        createdAt: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn("now"),
        },

        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn("now"),
        },

    });

    return Flight;
};