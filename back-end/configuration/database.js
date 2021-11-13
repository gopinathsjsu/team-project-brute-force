"use strict";
const Sequelize = require("sequelize");

const db = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        logging: console.log,
        maxConcurrentQueries: process.env.DATABASE_MAX_CONCURRENT_QUERIES,
        dialect: process.env.DATABASE_DIALECT,
        ssl: process.env.DATABASE_SSL,
        pool: {
            maxConnections: process.env.DATABASE_MAX_CONNECTIONS,
            maxIdleTime: process.env.DATABASE_MAX_IDLE_TIME,
            max: 5,
            idle: process.env.DATABASE_IDLE,
        },
        language: process.env.DATABASE_LANGUAGE,
    }
);

module.exports = db;
