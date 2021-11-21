import React, { Component } from 'react'
import SeatPicker from 'react-seat-picker'
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Redirect } from 'react-router-dom';
import cookie from "react-cookies";
import Modal from 'react-modal';
import { Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
    Col
} from 'reactstrap';
import "./boarding-pass.css"
import BACKEND_URL from '../config/config'
import axios from 'axios';
import moment from 'moment';

export class PurchaseSeats extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
        this.state = {
            loading: false,
            row: "",
            number: "",
            maxReservableSeats: this.props.match.params.quantity,
            flightNumber: this.props.match.params.flight,
            mileOption: this.props.match.params.mileoption,
            modalOpen: false,
            quantitySelected: 1, 
            arrivalTime : "",
            departureTime : "",
            source : "",
            destination : "",
            duration : "",
            price : this.props.match.params.price
        }
    }

    async componentDidMount() {
        console.log(this.props.match.params.flightNumber);
        axios.defaults.headers.common["authorization"] = "Bearer " + cookie.load('token')
        axios.defaults.withCredentials = true;
        axios.get(BACKEND_URL + "/flights/details/" + this.state.flightNumber)
        .then(response => {
            console.log(response.data.flight.departureTime-response.data.flight.arrivalTime);
            // console.log(response.data.flight.arrivalTime);
            
            this.setState(
                {
                    arrivalTime : response.data.flight.arrivalTime,
                    departureTime : response.data.flight.departureTime,
                    source : response.data.flight.source,
                    destination : response.data.flight.destination,
                    duration : response.data.flight.departureTime - response.data.flight.arrivalTime,
                }
            )
        })
    }
    toggleMessagesPopUp = (e) => {
        if (this.state.row == "") {
            alert("Please select a seat");
            return;
        }
        this.setState({
            modalOpen: !this.state.modalOpen

        })
    }
    addSeatCallback = ({ row, number, id }, addCb) => {
        this.setState({
            loading: true
        }, async () => {
            console.log(`Added seat ${number}, row ${row}, id ${id}`)
            let present_seats = this.state.row;
            present_seats = present_seats + " " + row + " " + number + "," ;
            const newTooltip = `${row} + ${number}`
            addCb(row, number, id, newTooltip)
            this.setState({ loading: false, row: present_seats, number: number })
        })
    }

    handleReservation = (e) => {
        const data = {
            flightNumber: this.state.flightNumber,
            quantity : this.state.quantitySelected,
            shouldUseMiles : Number(this.state.mileOption)
        }
        console.log(data);
        axios.defaults.headers.common["authorization"] = "Bearer " + cookie.load('token')
        axios.defaults.withCredentials = true;
        axios.post(BACKEND_URL + "/reservations/create/",data)
        .then(response => {
            console.log(response);
            if(response.status == 200){
                cookie.save("miles", response.data.reservation.updatedMiles, {
                    path: '/',
                    httpOnly: false,
                    maxAge: 90000
                })
                window.location.assign("/upcoming-reservations");
            }
        }).catch(e => {
            console.log(e.response);
        })
    }
    removeSeatCallback = ({ row, number, id }, removeCb) => {
        this.setState({
            loading: true
        }, async () => {
            console.log(`Removed seat ${number}, row ${row}, id ${id}`)
            // A value of null will reset the tooltip to the original while '' will hide the tooltip
            const newTooltip = ['A', 'B', 'C'].includes(row) ? null : ''
            removeCb(row, number, newTooltip)

            this.setState({ loading: false, row: "", number: "" })
        })
    }
    render() {
        console.log(this.state);
        let redirectVar = null;
        if (!cookie.load("auth")) {
            redirectVar = <Redirect to="/login" />
        }
        const rows = [
            [{ id: 1, number: 1, isSelected: true }, { id: 2, number: 2, tooltip: 'Cost: 15$' }, null, { id: 3, number: '3', isReserved: true, orientation: 'east', tooltip: 'Reserved' }, { id: 4, number: '4', orientation: 'west' }, null, { id: 5, number: 5 }, { id: 6, number: 6 }],
            [{ id: 7, number: 1, isReserved: true, tooltip: 'Reserved' }, { id: 8, number: 2, isReserved: true, tooltip: 'Reserved' }, null, { id: 9, number: '3', isReserved: true, orientation: 'east', tooltip: 'Reserved' }, { id: 10, number: '4', orientation: 'west' }, null, { id: 11, number: 5 }, { id: 12, number: 6 }],
            [{ id: 13, number: 1 }, { id: 14, number: 2 }, null, { id: 15, number: 3, isReserved: true, orientation: 'east', tooltip: 'Reserved' }, { id: 16, number: '4', orientation: 'west' }, null, { id: 17, number: 5 }, { id: 18, number: 6 }],
            [{ id: 19, number: 1, tooltip: 'Cost: 25$' }, { id: 20, number: 2 }, null, { id: 21, number: 3, orientation: 'east' }, { id: 22, number: '4', orientation: 'west' }, null, { id: 23, number: 5 }, { id: 24, number: 6 }],
            [{ id: 25, number: 1, isReserved: true, tooltip: 'Reserved' }, { id: 26, number: 2, orientation: 'east' }, null, { id: 27, number: '3', isReserved: true, tooltip: 'Reserved' }, { id: 28, number: '4', orientation: 'west' }, null, { id: 29, number: 5, tooltip: 'Cost: 11$' }, { id: 30, number: 6, isReserved: true, tooltip: 'Reserved' }],
            [{ id: 31, number: 1, isReserved: true, tooltip: 'Reserved' }, { id: 32, number: 2, orientation: 'east' }, null, { id: 33, number: 3, isReserved: true, tooltip: 'Reserved' }, { id: 34, number: 4, orientation: 'west' }, null, { id: 35, number: 5, tooltip: 'Cost: 11$' }, { id: 36, number: 6, isReserved: true, tooltip: 'Reserved' }],
            [{ id: 37, number: 1, isReserved: true, tooltip: 'Reserved' }, { id: 38, number: 2, orientation: 'east' }, null, { id: 39, number: 3, isReserved: true, tooltip: 'Reserved' }, { id: 40, number: 4, orientation: 'west' }, null, { id: 41, number: 5, tooltip: 'Cost: 11$' }, { id: 42, number: 6, isReserved: true, tooltip: 'Reserved' }],
            [{ id: 43, number: 1, isReserved: true, tooltip: 'Reserved' }, { id: 44, number: 2, orientation: 'east' }, null, { id: 45, number: 3, isReserved: true, tooltip: 'Reserved' }, { id: 46, number: 4, orientation: 'west' }, null, { id: 47, number: 5, tooltip: 'Cost: 11$' }, { id: 48, number: 6, isReserved: true, tooltip: 'Reserved' }],
            [{ id: 49, number: 1, isReserved: true, tooltip: 'Reserved' }, { id: 50, number: 2, orientation: 'east' }, null, { id: 51, number: 3, isReserved: true, tooltip: 'Reserved' }, { id: 52, number: 4, orientation: 'west' }, null, { id: 53, number: 5, tooltip: 'Cost: 11$' }, { id: 54, number: 6, isReserved: true, tooltip: 'Reserved' }],
            [{ id: 54, number: 1, isReserved: true, tooltip: 'Reserved' }, { id: 56, number: 2, orientation: 'east' }, null, { id: 57, number: 3, isReserved: true, tooltip: 'Reserved' }, { id: 58, number: 4, orientation: 'west' }, null, { id: 59, number: 5, tooltip: 'Cost: 11$' }, { id: 60, number: 6, isReserved: true, tooltip: 'Reserved' }],
            [{ id: 60, number: 1, isReserved: true, tooltip: 'Reserved' }, { id: 62, number: 2, orientation: 'east' }, null, { id: 63, number: 3, isReserved: true, tooltip: 'Reserved' }, { id: 64, number: 4, orientation: 'west' }, null, { id: 65, number: 5, tooltip: 'Cost: 11$' }, { id: 66, number: 6, isReserved: true, tooltip: 'Reserved' }],
            [{ id: 66, number: 1, isReserved: true, tooltip: 'Reserved' }, { id: 68, number: 2, orientation: 'east' }, null, { id: 69, number: 3, isReserved: true, tooltip: 'Reserved' }, { id: 70, number: 4, orientation: 'west' }, null, { id: 71, number: 5, tooltip: 'Cost: 11$' }, { id: 72, number: 6, isReserved: true, tooltip: 'Reserved' }]

        ]
        const { loading } = this.state
        return (

            <div style={{ marginLeft: "40%", marginTop: "10%" }}>
                { redirectVar}
                <SeatPicker
                    addSeatCallback={this.addSeatCallback}
                    removeSeatCallback={this.removeSeatCallback}
                    rows={rows}
                    maxReservableSeats={this.state.maxReservableSeats}
                    alpha
                    visible
                    loading={loading}
                    tooltipProps={{ multiline: true }}
                />
                <h3> Selected seat : {this.state.row}</h3>
                <Col style={{ paddingTop: "10px" }}>
                    <button className="btn btn-success" onClick={this.toggleMessagesPopUp}>Reserve</button>
                    {/* <button type="button" class="btn btn-success">Purchase Seats </button> */}
                </Col>
                <Modal isOpen={this.state.modalOpen} style={{
                    overlay: {
                        position: 'fixed',
                        top: -200,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.25)'
                    },
                    content: {
                        top: '0%',
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
                        <button className="btn btn-danger" style={{ marginLeft: "80vh" }} onClick={this.toggleMessagesPopUp}>Close </button>
                    </div>
                    <Row style={{ marginLeft: "60px", paddingTop: "10px" }}>

                    </Row>
                    <Row style={{ marginLeft: "60px", paddingTop: "50px" }}>

                    </Row>
                    <Row style={{ marginLeft: "100px"}}>
                        <div class="cardContainer" style={{ "height": "300px", transition: "0.9s" }}>
                            <div class="firstDisplay">
                                <div class="flightDetail">
                                    <div class="detailLabel" style={{ "font-weight": "bold", color: "rgb(13, 28, 83)" }}>
                                        From
</div>
{this.state.source}
                                </div>
                                <div class="flightDetail" style={{ marginTop: "15px" }}>
                                    <div class="animContainer">
                                        <div class="anim">
                                            <div class="circle"></div>
                                            <div class="circle"></div>
                                            <div class="circle"></div>
                                        </div>
                                    </div>
                                    <div class="animContainer" style={{ left: "62px" }}>
                                        <div class="anim">
                                            <div class="circle"></div>
                                            <div class="circle"></div>
                                            <div class="circle"></div>
                                        </div>
                                    </div>
                                    {/* <img src="airplane2.png" style={{width : "30px"}}></img> */}
                                </div>
                                <div class="flightDetail">
                                    <div class="detailLabel" style={{ fontWeight: "bold", color: "rgb(13, 28, 83)" }}>To</div>
{this.state.destination}
                                </div>
                            </div>
                            <div class="first" style={{ transform: "rotate3d(1,0,0,-180deg)", transitionDelay: "0s" }}>
                                <div class="firstTop">
                                    {/* <img src="https://beebom.com/wp-content/uploads/2018/12/Lufthansa-Logo.jpg" style={{height : "51px",margin : "22px 12px"}} ></img> */}
                                    <div class="timecontainer">
                                        <div class="detailDate">
                                            Bengaluru
<div class="detailTime"></div>June 12
</div>
                                        {/* <img src="airplane2.png" style={{widht : "30px",height :"26px",marginTop : "22px",marginLeft : "16px",marginRight : "16px"}} > </img> */}
                                        <div class="detailDate">
                                            New Delhi
<div class="detailTime">8:45</div>
June 12
</div>
                                    </div>
                                </div>
                                <div class="firstBehind">
                                    <div class="firstBehindDisplay">
                                        <div class="firstBehindRow">
                                            <div class="detail">
                                            {moment(this.state.departureTime).format("h:mm")} -{moment(this.state.arrival).format("h:mm")}
<div class="detailLabel">Flight Time</div>
                                            </div>
                                            <div class="detail">
                                                No
<div class="detailLabel">Transfer</div>
                                            </div>
                                        </div>
                                        <div class="firstBehindRow">
                                            <div class="detail">
                                            2:20
                                        <div class="detailLabel">Duration</div>
                                            </div>
                                            <div class="detail">8
                                        <div class="detailLabel">Gate</div>
                                            </div>
                                        </div>
                                        <div class="firstBehindRow">
                                            <div class="detail">{moment(this.state.departureTime).format("h:mm")}
                                        <div class="detailLabel">Boarding</div>
                                            </div>
                                            <div class="detail">{this.state.row}
                                                <div class="detailLabel">Seat</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="second" style={{ transform: "rotate3d(1, 0, 0, -180deg)", transitionDelay: "0.2s" }}>
                                        <div class="secondTop">
                                        </div>
                                        <div class="secondBehind">
                                            <div class="secondBehindDisplay">
                                                <div class="price">${this.state.price}
<div class="priceLabel">Price</div>
                                                </div>
                                                <div class="price">Economy
<div class="priceLabel">Class</div>
                                                </div>
                                                {/* <img class="barCode" src="barcode.png" ></img> */}
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                        <button className="btn btn-success" style={{ marginLeft: "35vh" }} onClick={this.handleReservation}>Review & Purchase </button>
                    </div>
                    </Row>
                </Modal>
            </div>
        )
    }
}


export default PurchaseSeats