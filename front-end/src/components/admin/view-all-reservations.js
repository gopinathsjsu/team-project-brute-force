import React, { Component } from 'react';
import cookie from "react-cookies";
import axios from 'axios';
import BACKEND_URL from '../config/config';
import IndividualReservation from './individual-reservations';
import emptyplaceholder from '../images/empty-placeholder.png';

class ViewAllReservations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reservationData: []
        }
    }
    async componentDidMount(){
        axios.defaults.headers.common["authorization"] = "Bearer " + cookie.load('token')
        axios.defaults.withCredentials = true;
        const response = await axios.get(BACKEND_URL + "/admin/viewallreservations");
        console.log(response.data.reservations);
        this.setState({
            reservationData : response.data.reservations,
        })
    }
    render() {
        let individualReservationDetails = null
        if (this.state.reservationData.length == 0) {
            individualReservationDetails = <div style={{ marginLeft: "300px" }}>
                <img src={emptyplaceholder} width="300px" height="200px" alt="" />
                <br></br>
                <br></br>
                <h4 style={{ font: "Bookman",paddingLeft :"100px" }}>Sorry!! No reservations yet</h4>
            </div>
        } else {
            individualReservationDetails = this.state.reservationData.map((reservation) => {
                return (
                    <div >
                        <IndividualReservation key={reservation} reservationData={reservation} />
                    </div>

                )
            })
        }
        return(
            <div style={{ paddingTop : "5%", paddingLeft: "20%", height: "100vh" }}>
                <h1>All Reservations</h1>
                <br></br>
                <br></br>

                {/* get flights */}
                {individualReservationDetails}
            </div>
        )
    }
}

export default ViewAllReservations