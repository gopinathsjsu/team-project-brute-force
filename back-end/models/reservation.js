"use strict";

module.exports = (Sequelize, db) => {
    const Reservation = db.define("reservation", {

        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },

        effectivePrice: {
            type: Sequelize.DOUBLE,
            allowNull: false,
        },

        milesUsed: {
            type: Sequelize.DOUBLE,
            allowNull: false,
            defaultValue: 0,
        },

        milesAwarded: {
            type: Sequelize.DOUBLE,
            allowNull: false,
            defaultValue: 0,
        },

        quantity: {
            type: Sequelize.BIGINT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isZeroOrLesser(value) {
                    if (value <= 0) {
                        throw new Error("Quantity should be a positive number");
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
    return Reservation;
};