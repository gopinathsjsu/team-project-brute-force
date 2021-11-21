import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import cookie from "react-cookies";
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Col
} from 'reactstrap';
import moment from 'moment';
import { Row } from 'react-bootstrap';
import './searched-flight.css'
import emptyplaceholder from '../images/empty-placeholder.png'
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import BACKEND_URL from '../config/config'
import axios from 'axios';
export class SearchedFlights extends Component {
    constructor(props) {
        super(props)
        this.state = {
            flightNumber: this.props.flightData.flightNumber,
            source: this.props.flightData.source,
            destination: this.props.flightData.destination,
            departureTime: this.props.flightData.departureTime,
            arrivalTime: this.props.flightData.arrivalTime,
            price: this.props.flightData.price,
            model: this.props.flightData.model,
            seatsLeft: this.props.flightData.seatsLeft,
            type: this.props.type,
            modalOpen: false,
            shouldUseMiles: "1",
            quantity: "1",
            effectivePrice: "",
            milesToBeUsed: "",
            milesToBeAwarded: "",
            error: false,
            errorMessage: "",
            purchaseSeatsDisable: false
        }

    }


    toggleMessagesPopUp = (e) => {
        axios.get(BACKEND_URL + "/reservations/effectiveprice?quantity=" + this.state.quantity + "&flightNumber=" + this.state.flightNumber + "&shouldUseMiles=" + this.state.shouldUseMiles)
            .then(response => {
                if (response.status == 200) {
                    if (response.status == 200) {
                        console.log(response.data)
                        this.setState(
                            {
                                effectivePrice: response.data.effectivePrice,
                                milesToBeUsed: response.data.milesToBeUsed,
                                milesToBeAwarded: response.data.milesToBeAwarded
                            }
                        )
                    }
                }

            }).catch(e => {
                this.setState(
                    {
                        error: true,
                        errorMessage: e.response.data.message,
                        purchaseSeatsDisable: true
                    }
                )
            })
        this.setState({
            modalOpen: !this.state.modalOpen

        })
    }

    handleQuantity = (e) => {

        this.setState(
            {
                quantity: e.target.value
            }
        )
        axios.get(BACKEND_URL + "/reservations/effectiveprice?quantity=" + e.target.value + "&flightNumber=" + this.state.flightNumber + "&shouldUseMiles=" + this.state.shouldUseMiles)
            .then(response => {
                if (response.status == 200) {
                    console.log(response.data)
                    if (response.status == 200) {
                        console.log(response.data)
                        this.setState(
                            {
                                effectivePrice: response.data.effectivePrice,
                                milesToBeUsed: response.data.milesToBeUsed,
                                milesToBeAwarded: response.data.milesToBeAwarded
                            }
                        )
                    }
                }

            }).catch(e => {
                this.setState(
                    {
                        error: true,
                        errorMessage: e.response.data.message,
                        purchaseSeatsDisable: true
                    }
                )
            })

    };
    handleMiles = (e) => {
        this.setState(
            {
                shouldUseMiles: e.target.value
            }
        )
        axios.get(BACKEND_URL + "/reservations/effectiveprice?quantity=" + this.state.quantity + "&flightNumber=" + this.state.flightNumber + "&shouldUseMiles=" + e.target.value)
            .then(response => {
                if (response.status == 200) {
                    console.log(response.data)
                    this.setState(
                        {
                            effectivePrice: response.data.effectivePrice,
                            milesToBeUsed: response.data.milesToBeUsed,
                            milesToBeAwarded: response.data.milesToBeAwarded
                        }
                    )
                }

            }).catch(e => {
                console.log(e.response)
                this.setState(
                    {
                        error: true,
                        errorMessage: e.response.data.message,
                        purchaseSeatsDisable: true
                    }
                )
            })
    };

    render() {
        let redirectVar = null
        if (!cookie.load("auth")) {
            redirectVar = <Redirect to="/login" />
        }
        let renderError = null
        if (this.state.error) {
            renderError = <div style={{ 'color': 'red' }}>{this.state.errorMessage}</div>
        }
        return (

            <div>
                {redirectVar}
                <Card style={{ backgroundColor: "whitesmoke" }}>
                    <CardBody>
                        <Row style={{ padding: "25px", marginLeft: "10px" }}>
                            <Col>
                                <Row>
                                    <h1>{this.state.flightNumber}</h1>
                                </Row>
                                <Row><h5>{this.state.source} - {this.state.destination}</h5></Row>

                            </Col>

                            <Col style={{ marginTop: "10px" }}>
                                <Row>
                                    <h5>
                                        Depart:- {''}
                                    </h5>
                                    {moment(this.state.departureTime).format("MMM")}
                                    {' '}{' '}
                                    {moment(this.state.departureTime).format("D")}
                                    {','}
                                    {moment(this.state.departureTime).format("YYYY")}
                                </Row>
                                <Row>
                                    <h1></h1>
                                </Row>
                                <Row>
                                    <strong>Time : </strong>{moment(this.state.departureTime).format("hh:mm:ss a")}
                                </Row>
                            </Col>
                            <Col style={{ marginTop: "10px", marginLeft: "60px" }}>
                                <Row>
                                    <h5>
                                        Arrive:- {'   '}
                                    </h5>
                                    {moment(this.state.arrivalTime).format("MMM")}
                                    {' '}{' '}
                                    {moment(this.state.arrivalTime).format("D")}
                                    {','}
                                    {moment(this.state.arrivalTime).format("YYYY")}
                                </Row>
                                <Row>
                                    <h1></h1>
                                </Row>
                                <Row>
                                    <strong>Time : </strong>{moment(this.state.arrivalTime).format("hh:mm:ss a")}
                                </Row>
                            </Col>
                            <Col style={{ marginLeft: "60px" }}>

                                <Row>
                                    <span class="price-value">
                                        <span class="currency">$</span> {this.state.price}
                                    </span>                                </Row>

                            </Col>
                            <Col style={{ paddingTop: "10px" }}>
                                <button className="btn btn-success" onClick={this.toggleMessagesPopUp}>Reserve</button>
                                {/* <button type="button" class="btn btn-success">Purchase Seats </button> */}
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Modal isOpen={this.state.modalOpen} style={{
                    overlay: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.25)'
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: '50%',
                        bottom: '50%',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        height: '500px', // <-- This sets the height
                        overlfow: 'scroll' // <-- This tells the modal to scrol
                    }
                }} >
                    <div className="row">
                        <button className="btn btn-danger" style={{ marginLeft: "85vh" }} onClick={this.toggleMessagesPopUp}>Close </button>
                    </div>
                    <Row style={{ marginLeft: "60px", paddingTop: "10px" }}>
                        <b>Want to use miles </b><select defaultValue="Ascending" onChange={this.handleMiles} name="sort" id="event">
                            <option value="1" selected>Use miles </option>
                            <option value="0">No, I am good</option>
                        </select>
                    </Row>
                    <Row style={{ marginLeft: "60px", paddingTop: "50px" }}>
                        <b>Select quantity </b><select defaultValue="1" onChange={this.handleQuantity} name="sort" id="event">
                            <option value="1" >1 </option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>

                        </select>
                    </Row>
                    <Col style={{ padding: "50px" }}>
                        {
                            !this.state.purchaseSeatsDisable ? <Link className="btn btn-warning" to={`/purchase-seats/${this.state.flightNumber}/${this.state.quantity}/${this.state.shouldUseMiles}/${this.state.effectivePrice}`} >
                                Purchase Seats </Link> : " "
                        }

                    </Col>
                    <Row>
                        <div style={{ marginLeft: "100px" }}>
                            <h5>Effective Price : {this.state.effectivePrice}</h5>
                            <h5>Miles Used : {this.state.milesToBeUsed}</h5>
                            <h5>Miles to be awarded : {this.state.milesToBeAwarded}</h5>
                        </div>
                    </Row>
                    {/* <> */}
                    <Row>
                        {renderError}
                    </Row>

                    {/* { displayConversation } */}
                </Modal>
            </div >
        )
    }
}

export default SearchedFlights
