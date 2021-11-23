import React, { Component } from 'react';
import Navbar from '../navbar/navbar';
import DateTimePicker from 'react-datetime-picker';
import cookie from "react-cookies";
import axios from 'axios';
import BACKEND_URL from '../config/config';
import AsyncSelect from "react-select/async";
import SearchedFlights from "../flights/searched-flights"
import emptyplaceholder from '../images/empty-placeholder.png'

class BookFlights extends Component {
    constructor(props) {
        super(props)
        this.state = {
            source: null,
            destination: null,
            noOfPeople: 1,
            date: null,
            fetchFlight: false,
            flightData : []
        }
    }
    handleSourceChange = (e) => {
        this.setState({
            source: e,
        })
    }
    handleDestinationChange = (e) => {
        this.setState({
            destination: e,
        })
    }
    searchSource = (inp, callback) => {
        axios.defaults.headers.common["authorization"] = "Bearer " + cookie.load('token')
        axios.defaults.withCredentials = true;
        axios.get(BACKEND_URL + '/masters/search?airport=' + inp)
            .then(response => {
                if (response.status === 200) {
                    const searchedAirports = response.data.airports.map((airport) => {
                        return {
                            label: airport.city + "(" + airport.name + ")",
                            value: airport.code,
                        };
                    });
                    callback(searchedAirports)
                }
            }).catch(e => {
                console.log(e.response);
            })

    };

    handleDateChange = (e) => {
        this.setState({
            date: e,
        })
    }
    submitFlight = (e) => {
        e.preventDefault();
        console.log(this.state);
        const data = {
            source: this.state.source.value,
            destination: this.state.destination.value,
            departureTime: this.state.date.toISOString()
        }
        axios.defaults.headers.common["authorization"] = "Bearer " + cookie.load('token')
        axios.defaults.withCredentials = true;
        axios.post(BACKEND_URL + '/flights/search', data)
            .then(response => {
                if (response.status == 200) {
                    console.log(response.data)
                    this.setState(
                        {
                            fetchFlight: true,
                            flightData: response.data.flights
                        }
                    )
                }

            }).catch(e => {

            })
    }
    render() {
        console.log(this.state);

        let individualFlightDetails = null
        console.log(this.state.flightData.length);
        if (this.state.fetchFlight) {

            if (this.state.flightData.length == 0) {
                
                individualFlightDetails = <div style={{ marginLeft: "300px", marginTop: "150px" }}>
                    <img src={emptyplaceholder} width="300px" height="200px" alt="" />
                    <br></br>
                    <br></br>
                    <h4 style={{ font: "Bookman" }}>Sorry!! There are no flights </h4>
                </div>
            }
            else {
                individualFlightDetails = this.state.flightData.map((flight) => {
                    return (
                        <div >
                            <SearchedFlights flightData={flight} />
                            {/* <IndividualFLight key={flight} type={"all"} flightData={flight} /> */}
                        </div>

                    )
                })
            }

        }
        return (
            <div>
                <div class="container">
                    <h1>Search and Book Flights</h1>
                    <form onSubmit={this.submitFlight}>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <div className="form-group col-md-6">
                                    <label for="source">From</label>
                                    <AsyncSelect
                                        isClearable
                                        value={this.state.source}
                                        onChange={this.handleSourceChange}
                                        placeholder={"Search"}
                                        loadOptions={this.searchSource}
                                    />
                                </div>
                            </div>
                            <div class="form-group col-md-6">
                                <div className="form-group col-md-6">
                                    <label for="source">To</label>
                                    <AsyncSelect
                                        isClearable
                                        value={this.state.destination}
                                        onChange={this.handleDestinationChange}
                                        placeholder={"Search"}
                                        loadOptions={this.searchSource}
                                    />
                                </div>                            </div>
                        </div>
                        <br></br>
                        
                        <br></br>

                        <div class="form-row">
                            <div class="form-group col-md-6" style={{ paddingLeft: "20px" }}>
                                <label for="date">Date</label>
                                <br />
                                <DateTimePicker onChange={this.handleDateChange} value={this.state.date} disableClock={true} format={"y-MM-dd"} />
                            </div>
                        </div>
                        <div style={{ margin: "15px" }}>
                            <button type="submit" class="btn btn-primary">Search</button>
                        </div>
                    </form>

                    {individualFlightDetails}
                </div>
            </div>
        )
    }
}

export default BookFlights