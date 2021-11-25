import React, { Component } from 'react';
import cookie from "react-cookies";
import {
    Card, CardBody,Col, Row
} from 'reactstrap';
import moment from 'moment';

export class IndividualReservation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            flightNumber: this.props.reservationData.flight.flightNumber,
            firstName: this.props.reservationData.user.firstName,
            lastName: this.props.reservationData.user.lastName,
            email: this.props.reservationData.user.email,
            source: this.props.reservationData.flight.source,
            destination: this.props.reservationData.flight.destination,
            quantity: this.props.reservationData.quantity,
        }
    }
    
    render() {
        let renderData = <Card style={{ backgroundColor: "whitesmoke" }}>
                <CardBody>
                    <Row>
                        <Col>
                            <Row>
                                <Col>
                                <strong>Flight</strong>
                                </Col>
                            </Row>
                            <strong>{this.state.flightNumber}</strong>
                            <Row>
                                <Col>
                                    <strong>{this.state.source} {this.state.destination}</strong>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    {this.state.firstName} {this.state.lastName}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {this.state.email} 
                                </Col>
                            </Row>
                            <strong>Seats: </strong>{this.state.quantity}
                        </Col>
                    </Row>
                      
                </CardBody>
            </Card>
        return (
            <div style={{ padding: "1%", height: "150px", width: "80%" }}>
                {renderData}
            </div>
        )
    }

}

export default IndividualReservation;