import React, { Component } from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Col, Row
} from 'reactstrap';
import moment from 'moment';
import cookie from "react-cookies";
import axios from 'axios';
import BACKEND_URL from '../config/config';
import { Redirect } from 'react-router-dom';
export class UpcomingIndividualReservation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            flightNumber: this.props.reservationData.flight.flightNumber,
            source: this.props.reservationData.flight.source,
            destination: this.props.reservationData.flight.destination,
            departureTime: this.props.reservationData.flight.departureTime,
            arrivalTime: this.props.reservationData.flight.arrivalTime,
            id: this.props.reservationData.id,
        }
    }
    componentDidMount() {
        console.log("IND")
        console.log(this.props)
    }
    handleCancelClick = (e) =>{
        let input = window.confirm("Do you want to cancel your reservation?")
        if(input == true){
            // cancel reservation
            let data = {
                id: this.state.id,
            }
            axios.defaults.headers.common["authorization"] = "Bearer " + cookie.load('token')
            axios.defaults.withCredentials = true;
            axios.post(BACKEND_URL + '/reservations/cancel', data)
            .then((response) => {
                if(response.status === 200){
                    cookie.save("miles", response.data.reservation.updatedMiles, {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    })
                    window.alert("Successfully cancelled")
                    window.location.reload();
                } else {
                    window.alert("Reservation cannot be cancelled")
                    this.setState({
                        error: true,
                        errorMessage: "",
                    })
                }
            }).catch((err) => {
                window.alert("Reservation cannot be cancelled")
                this.setState({
                    error: true,
                    errorMessage: "",
                })
            })
        } else {
            // do nothing
        }
    }
    render() {
        let redirectVar = null
        if (!cookie.load("auth")) {
            redirectVar = <Redirect to="/login" />
        }
        console.log(this.state);
        let renderData = <Card style={{ backgroundColor: "whitesmoke" }}>
            <CardBody>
                <Row>
                    <Col>
                        <strong>Flight Number: </strong>{this.state.flightNumber}
                        <Row>
                            <Col>
                                <strong>{this.state.source} To {this.state.destination}</strong>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                <Row>
                                    <strong>Departure:</strong>
                                    {moment(this.state.departureTime).format("MMM")}
                                    {' '}{' '}
                                    {moment(this.state.departureTime).format("D")}
                                    {','}
                                    {moment(this.state.departureTime).format("YYYY")}
                                    {' '}
                                    {moment(this.state.departureTime).format("HH")}
                                    {':'}
                                    {moment(this.state.departureTime).format("MM")}
                                </Row>
                                <Row>
                                    <strong>Arrival:</strong>
                                    {moment(this.state.arrivalTime).format("MMM")}
                                    {' '}{' '}
                                    {moment(this.state.arrivalTime).format("D")}
                                    {','}
                                    {moment(this.state.arrivalTime).format("YYYY")}
                                    {' '}
                                    {moment(this.state.arrivalTime).format("HH")}
                                    {':'}
                                    {moment(this.state.arrivalTime).format("MM")}
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <button type="button" class="btn btn-danger" onClick={this.handleCancelClick}>Cancel</button>
                    </Col>
                </Row>
            </CardBody>
        </Card>
        return (
            <div style={{ padding: "1%", height: "150px", width: "80%" }}>
                {redirectVar}
                {renderData}
            </div>
        )
    }
}

export default UpcomingIndividualReservation;