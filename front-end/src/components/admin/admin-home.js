import React, { Component } from 'react';
import Navbar from '../navbar/navbar';
import BACKEND_URL from '../config/config'
import axios from 'axios';
import cookie from "react-cookies";
import IndividualFLight from './individual-flight';
import { matchPath } from 'react-router';
import emptyplaceholder from '../images/empty-placeholder.png'
import '../css/pagination.css'
import ReactPaginate from 'react-paginate';

class AdminHome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: null,
            flightData: [],
            offset: 0,
            perPage: 5,
            pageCount: 0
        }
    }
    handlePageClick = (e) => {

        this.setState({
            offset: this.state.perPage * e.selected,

        })

    };
    async componentDidMount() {
        console.log("response.data");
        axios.defaults.headers.common["authorization"] = "Bearer " + cookie.load('token')
        axios.defaults.withCredentials = true;
        const response = await axios.get(BACKEND_URL + "/admin/viewmyflights");
        this.setState({
            flightData: response.data.flights,
            pageCount: Math.ceil(response.data.flights.length / this.state.perPage)
        })

    }

    render() {
        let individualFlightDetails = null
        if (this.state.flightData.length == 0) {
            individualFlightDetails = <div style={{ marginLeft: "300px", marginTop: "150px" }}>
                <img src={emptyplaceholder} width="300px" height="200px" alt="" />
                <br></br>
                <br></br>
                <h4 style={{ font: "Bookman" }}>Sorry!! You have not created any flights</h4>
            </div>
        }
        else {
            individualFlightDetails = this.state.flightData.slice(this.state.offset, this.state.offset + this.state.perPage).map((flight) => {
                return (
                    <IndividualFLight key={flight.flightID} type={"all"} flightData={flight} />
                )
            })
        }
        return (
            <div>
                <div style={{ paddingTop: "5%", paddingLeft: "20%" }}>
                    <h1>Your flights</h1>
                    <br></br>
                    <br></br>

                    {/* get flights */}
                    {individualFlightDetails}
                </div>
                <div className="row">
                    <div className="row" style={{ marginLeft: "45%" }}>
                        <ReactPaginate
                            previousLabel={"prev"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"} />

                    </div>
                </div>
            </div>
        )
    }
}

export default AdminHome