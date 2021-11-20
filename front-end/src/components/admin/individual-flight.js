import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import cookie from "react-cookies";
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Col
} from 'reactstrap';
import moment from 'moment';

import { Row } from 'react-bootstrap';
export class IndividualFLight extends Component {
    constructor(props) {
        super(props)
        this.state = {
            flightNumber: this.props.flightData.flightNumber,
            source: this.props.flightData.source,
            destination: this.props.flightData.destination,
            departureTime: this.props.flightData.departureTime,
            arrivalTime: this.props.flightData.arrivalTime,
            capacity: this.props.flightData.capacity,
            model: this.props.flightData.model,
            seatsLeft: this.props.flightData.seatsLeft,
            userName: this.props.flightData.user.id == cookie.load("id") ? "You" : this.props.flightData.user.firstName + " " + this.props.flightData.user.lastName,
            type: this.props.type
        }
    }
    render() {
        let renderData = null;
        if (this.state.type == "particular") {
            renderData = <Card style={{ backgroundColor: "whitesmoke" }}>
                <CardBody>
                    <Row>
                        <Col style={{ paddingLeft: "20px" }}>
                            <h2>{this.state.flightNumber}</h2>
                        </Col>
                        <Col>
                            <Row>
                                <h5>Journey</h5>
                            </Row>
                            <Row><h5>{this.state.source} - {this.state.destination}</h5></Row>

                        </Col>

                        <Col>
                            <Row>
                                <h5>
                                    Departing on :- {'   '}
                                </h5>
                                {moment(this.state.departureTime).format("MMM")}
                                {' '}{' '}
                                {moment(this.state.departureTime).format("D")}
                                {','}
                                {moment(this.state.departureTime).format("YYYY")}
                            </Row>
                            <Row>
                                <strong>Time : </strong>{moment(this.state.departureTime).format("hh:mm:ss a")}
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <h5>
                                    Arriving on :- {'   '}
                                </h5>
                                {moment(this.state.arrivalTime).format("MMM")}
                                {' '}{' '}
                                {moment(this.state.arrivalTime).format("D")}
                                {','}
                                {moment(this.state.arrivalTime).format("YYYY")}
                            </Row>
                            <Row>
                                <strong>Time : </strong>{moment(this.state.arrivalTime).format("hh:mm:ss a")}
                            </Row>
                        </Col>

                    </Row>
                </CardBody>
            </Card>
        }
        else {
            renderData = <Card style={{ backgroundColor: "whitesmoke" }}>
                <CardBody>
                    <Row>
                        <Col style={{ paddingLeft: "20px" }}>
                            <h2>{this.state.flightNumber}</h2>
                        </Col>
                        <Col>
                            <Row>
                                <h5>Journey</h5>
                            </Row>
                            <Row><h5>{this.state.source} - {this.state.destination}</h5></Row>

                        </Col>

                        <Col>
                            <Row>
                                <h5>
                                    Departing on :- {'   '}
                                </h5>
                                {moment(this.state.departureTime).format("MMM")}
                                {' '}{' '}
                                {moment(this.state.departureTime).format("D")}
                                {','}
                                {moment(this.state.departureTime).format("YYYY")}
                            </Row>
                            <Row>
                                <strong>Time : </strong>{moment(this.state.departureTime).format("hh:mm:ss a")}
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <h5>
                                    Arriving on    :- {'   '}
                                </h5>
                                {moment(this.state.arrivalTime).format("MMM")}
                                {' '}{' '}
                                {moment(this.state.arrivalTime).format("D")}
                                {','}
                                {moment(this.state.arrivalTime).format("YYYY")}
                            </Row>
                            <Row>
                                <strong>Time : </strong>{moment(this.state.arrivalTime).format("hh:mm:ss a")}
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <h5>Created by</h5>
                            </Row>
                            <Row><em>{this.state.userName}</em></Row>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        }
        return (
            <div style={{ padding: "1%", height: "150px", width: "80%" }}>
                {renderData}
            </div>
        )
    }
}

export default IndividualFLight
