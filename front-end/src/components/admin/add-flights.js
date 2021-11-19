import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';
import cookie from "react-cookies";
import axios from 'axios';
import BACKEND_URL from '../config/config';
import AsyncSelect from "react-select/async";
import Navbar from '../navbar/navbar';

class AddFlights extends Component {
    constructor(props) {
        super(props)
        this.state = {
            flightNumber: null,
            source: null,
            destination: null,
            departureTime: null,
            arrivalTime: null,
            price: null,
            capacity: null,
            manufacturer: null,
            model: null,
            distance: null,
            error: false,
            errorMessage: null,
            successFlag: false,
            successMessage: null,
        }
    }
    handleFlightNumberChange = (e) => {
        this.setState({
            flightNumber: e.target.value,
        })
    }
    handleSourceChange = (e) => {
        console.log(e);
        this.setState({
            source: e,
        })
    }
    handleDestinationChange = (e) => {
        this.setState({
            destination: e,
        })
    }
    handlePriceChange = (e) => {
        this.setState({
            price: e.target.value,
        })
    }
    handleCapacityChange = (e) => {
        this.setState({
            capacity: e.target.value,
        })
    }
    handleManufacturerChange = (e) => {
        this.setState({
            manufacturer: e.target.value,
        })
    }
    handleModelChange = (e) => {
        this.setState({
            model: e.target.value,
        })
    }
    handleDistanceChange = (e) => {
        this.setState({
            distance: e.target.value,
        })
    }
    handleDepartureTimeChange = (e) => {
        this.setState({
            departureTime: e,
        })
    }
    handleArrivalTimeChange = (e) => {
        this.setState({
            arrivalTime: e,
        })
    }
    handlePriceChange = (e) => {
        this.setState({
            price: e.target.value,
        })
    }
    handleManufacturerChange = (e) => {
        this.setState({
            manufacturer: e.target.value,
        })
    }
    handleModelChange = (e) => {
        this.setState({
            model: e.target.value,
        })
    }
    searchSource = (inp, callback) => {
        console.log(inp);
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
                console.log("inside search catch");
                console.log(e.response);
            })

    };
    searchDestination = (inp, callback) => {
        console.log(inp);
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
                console.log("inside search catch");
                console.log(e.response);
            })

    };
    submitFlight = (e) => {
        e.preventDefault();
        const data = {
            flightNumber: this.state.flightNumber,
            source: this.state.source.value,
            destination: this.state.destination.value,
            departureTime: this.state.departureTime.toISOString(),
            arrivalTime: this.state.arrivalTime.toISOString(),
            price: this.state.price,
            capacity: this.state.capacity,
            manufacturer: this.state.manufacturer,
            model: this.state.model,
            distance: this.state.distance,
        }
        console.log(data);
        axios.defaults.headers.common["authorization"] = "Bearer " + cookie.load('token')
        axios.defaults.withCredentials = true;
        axios.post(BACKEND_URL + '/admin/createflight', data)
        .then((response) => {
            console.log("=========="+response)
            if(response.status == 200){
                console.log("create flight successful")
                this.setState({
                    error: false,
                    errorMessage: null,
                    successFlag: true,
                    successMessage: "Flight added successfully"
                })
                window.location.assign("/admin-home")
            } else {
                console.log("not successful")
                this.setState({
                    error: true,
                    errorMessage: response.message,
                })
            }
        }).catch((err) => {
            console.log(err.response);
            if(err.response.status === 400){
                this.setState({
                    error: true, 
                    errorMessage : err.response.data.message
                }) 
            }else{
                this.setState({
                    error: true, 
                    errorMessage : err.response.data.errorMessage
                })
            }
        })

    }
    render() {
        console.log(this.state.successFlag);
        return (
            <div>
                <div className="container">
                    <h1>Add Flight</h1>
                    <form method="post" onSubmit={this.submitFlight}>
                        <div className="form-row">
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
                            <div className="form-group col-md-6">
                                <label for="destination">To</label>
                                <AsyncSelect
                                        isClearable
                                        value={this.state.destination}
                                        onChange={this.handleDestinationChange}
                                        placeholder={"Search"}
                                        loadOptions={this.searchDestination}
                                    />
                            </div>
                        </div>

                        <br />
                        <br />
                        <br />
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label for="distance">Distance (in miles)</label>
                                <input type="number" className="form-control" id="distance" onChange={this.handleDistanceChange} required />
                            </div>
                            <div className="form-group col-md-6">
                                <label for="distance">Flight Number</label>
                                <input type="number" className="form-control" id="flightNumber" onChange={this.handleFlightNumberChange} required />
                            </div>

                        </div>
                        <br />
                        <br />
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label for="price">Price</label>
                                <input type="number" step=".01" placeholder="0.00" min="0.01" className="form-control" id="price" required onChange={this.handlePriceChange}/>
                            </div>
                            <div className="form-group col-md-6">
                                <label for="capacity">Capacity</label>
                                <input type="number" className="form-control" id="capacity" placeholder="0" required onChange={this.handleCapacityChange}/>
                            </div>
                        </div>
                        <br />
                        <br />
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label for="manufacturer">Manufacturer</label>
                                <input type="text" className="form-control" id="manufacturer" onChange={this.handleManufacturerChange}/>
                            </div>
                            <div className="form-group col-md-6">
                                <label for="model">Model</label>
                                <input type="text" className="form-control" id="model" onChange={this.handleModelChange}/>
                            </div>
                        </div>
                        <br />
                        <br />
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label for="startDate">Departure</label>
                                <br/>
                                <DateTimePicker onChange={this.handleDepartureTimeChange} value={this.state.departureTime} style={{width: "500px"}} required />
                            </div>
                            <div className="form-group col-md-6">
                                <label for="endDate">Arrival</label>
                                <br/>
                                <DateTimePicker onChange={this.handleArrivalTimeChange} value={this.state.arrivalTime} style={{width: "500px"}} required />
                            </div>
                        </div>
                        <br />
                        <br />

                        <button type="submit" className="btn btn-primary">Submit</button>
                        <br/><br/>
                        {this.state.error ? <div class="alert alert-danger" role="alert">{this.state.errorMessage}</div> : null}
                        {this.state.successFlag ? <div class="alert alert-success" role="alert">{this.state.successMessage}</div> : null}
                    </form>
                </div>

            </div>
        )
    }
}
export default AddFlights