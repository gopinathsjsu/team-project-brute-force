"use strict";

module.exports = (Sequelize, db) => {
    const User = db.define("user", {

        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },

        firstName: {
            type: Sequelize.STRING(64),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        lastName: {
            type: Sequelize.STRING(64),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },

        email: {
            type: Sequelize.STRING(64),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "It should be a valid email address",
                },
            },
        },

        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },

        gender: {
            type: Sequelize.ENUM,
            values: ["MALE", "FEMALE", "OTHER"],
            allowNull: true,
            validate: {
                notEmpty: false,
            },
        },

        role: {
            type: Sequelize.ENUM,
            values: ["ADMIN", "CUSTOMER"],
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },

        miles: {
            type: Sequelize.BIGINT,
            allowNull: false,
            defaultValue: 0,
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
    return User;
};