import React, { Component } from 'react';
import cookie from "react-cookies";
import axios from 'axios';
import BACKEND_URL from '../config/config';
import emptyplaceholder from '../images/empty-placeholder.png';
import UpcomingIndividualReservation from './view-individual-upcoming-res';
import { Redirect } from 'react-router-dom';
class ViewUpcomingReservations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reservationData: []
        }
    }
    async componentDidMount(){
        axios.defaults.headers.common["authorization"] = "Bearer " + cookie.load('token')
        axios.defaults.withCredentials = true;
        const response = await axios.get(BACKEND_URL + "/reservations/get");
        console.log(response.data.upcomingReservations);
        this.setState({
            reservationData : response.data.upcomingReservations,
        })
    }
    render() {
        let individualReservationDetails = null
        if (this.state.reservationData.length == 0) {
            individualReservationDetails = <div style={{ marginLeft: "300px" }}>
                <img src={emptyplaceholder} width="300px" height="200px" alt="" />
                <br></br>
                <br></br>
                <h4 style={{ font: "Bookman",paddingLeft :"100px" }}>Sorry!! No upcoming reservations</h4>
            </div>
        } else {
            individualReservationDetails = this.state.reservationData.map((reservation) => {
                return (
                    <div >
                        <UpcomingIndividualReservation key={reservation} reservationData={reservation} />
                    </div>

                )
            })
        }
        return(
            <div style={{ paddingTop : "5%", paddingLeft: "20%", height: "100vh" }}>
                <h1>Upcoming Reservations</h1>
                <br></br>
                <br></br>

                {/* get reservations */}
                {individualReservationDetails}
            </div>
        )
    }
}

export default ViewUpcomingReservations