"use strict";
const express = require("express");
const axios = require("axios");

// Initializing Router
const router = express.Router();

// Find Possible places
router.get('/search', async (req, res) => {
    const airport = req.query.airport;
    if (!airport || airport.length < 3) {
        res.status(400).send({ message: "Enter atleast 3 characters to search an airport" });
        return;
    }

    try {
        const response = await axios.post(process.env.SEARCH_FLIGHTS_API + "?term=" + airport, {},
            {
                headers: { "APC-Auth": process.env.APC_AUTH, "APC-AUTH-SECRET": process.env.APC_AUTH_SECRET }
            });

        if (response.data && response.data.statusCode == 404) {
            res.status(400).send({
                message: "No results found for search term."
            });
            return;
        }

        const airports = response.data.airports.map((rawAirport) => {
            return {
                name: rawAirport.name,
                city: rawAirport.city,
                state: rawAirport.state.name,
                country: rawAirport.country.name,
                code: rawAirport.iata,
            };
        });

        res.status(200).send({ airports, message: "Successfully fetched airport data" });
        return;

    } catch (error) {
        console.log(error);
        res.status(400).send({ error });
    }
});

module.exports = router;