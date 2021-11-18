import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import cookie from "react-cookies";
import BACKEND_URL from '../config/config'
import expedia_image from '../images/expedia_logo.jpeg'


export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "passenger",
            email: '',
            password: '',
            error: false,
            errorMessage: '',
        }
    }
    //handle input change
    handleInputChange = inp => {
        // console.log( inp.target.name, inp.target.value );
        if (/[~`!#$@%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(inp.target.value)) {
            this.setState({
                error: true,
                errorMessage: "Special characters not allowed",
                [inp.target.name]: ""
            })
        } else {
            this.setState({
                error: false,
                [inp.target.name]: inp.target.value
            })
        }
    }
    handlePasswordChange = inp => {
        this.setState({
            password: inp.target.value
        })

    }
    handleEmailChange = inp => {
        // console.log( inp.target.name, inp.target.value );
        if (/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(inp.target.value)) {
            this.setState({
                error: true,
                errorMessage: "Special characters not allowed",
                [inp.target.name]: ""
            })
        } else {
            this.setState({
                error: false,
                [inp.target.name]: inp.target.value
            })
        }
    }
    //handle submit
    handleSubmit = sub => {
        // to prevent refresh 
        sub.preventDefault();
        if (this.state.type === "") {
            this.setState({
                error: true,
                errorMessage: "Please Select type of employee"
            })
        } else {
            const loginUser = {
                email : this.state.email,
                password : this.state.password
            }
            axios
                .post(BACKEND_URL + '/users/login', loginUser)
                .then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        this.setState({
                            error: false
                        }) 
                        cookie.save("auth", true, {
                            path: '/',
                            httpOnly: false,
                            maxAge: 90000
                        })
                        cookie.save("token", response.data.token, {
                            path: '/',
                            httpOnly: false,
                            maxAge: 90000
                        })
                        cookie.save("miles", response.data.user.miles, {
                            path: '/',
                            httpOnly: false,
                            maxAge: 90000
                        })
                        cookie.save("id", response.data.user.id, {
                            path: '/',
                            httpOnly: false,
                            maxAge: 90000
                        })
                        cookie.save("firstName", response.data.user.firstName, {
                            path: '/',
                            httpOnly: false,
                            maxAge: 90000
                        })
                        cookie.save("role", response.data.user.role, {
                            path: '/',
                            httpOnly: false,
                            maxAge: 90000
                        })
                        if(response.data.user.role === 'ADMIN'){
                            window.location.assign('/admin-home')
                        }
                        else{
                            window.location.assign('/create-reservation')
                        }
                        
                    }
                    else if(response.status === 401){
                        console.log("here");
                        this.setState({
                            error: true, 
                            errorMessage : response.message
                        })
                    }

                })
                .catch((err) => {
                    if(err.response.status === 401){
                        this.setState({
                            error: true, 
                            errorMessage : err.response.data.message
                        })
                    }
                    else{
                        this.setState({
                            error: true, 
                            errorMessage : err.response.data.errorMessage
                        })
                    }

                });
        }
    }
    render() {
        let renderError = null
        if (this.state.error) {
            renderError = <div style={{ 'color': 'red' }}>{this.state.errorMessage}</div>
        }
        return (
            <div style={{ backgroundColor: "whitesmoke" }}>
                <div className="row" style={{ height: "100vh", "padding": "10%" }}>
                    <div className="col-4">
                        <div className="row" style={{ height: "12%" }}>
                        </div>
                        <div className="row">
                            <div className="row" style={{ "padding": "5%" }}>
                                <img src={expedia_image} style={{ "paddingLeft": "40%" }} width="100%" height="100%" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-5" style={{ "paddingLeft": "7%" }}>
                        <div className="row" style={{ height: "10%" }}>
                        </div>
                        <div className="row" style={{ height: "90%" }}>
                            <div className="col-12">
                                <div>
                                    <h2 style={{ "margin": "10px", color: "#6244BB" }}>Spartan Airlines </h2></div>
                                <form onSubmit={this.handleSubmit} id="Login">
                                    <div className="form-group">
                                        <input type="email" className="form-control" name="email" required
                                            autoFocus placeholder="Enter Email" onChange={this.handleEmailChange} />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control" name="password" required
                                            placeholder="Enter Password" onChange={this.handlePasswordChange} />
                                    </div>
                                    <button type="submit" className="btn btn-warning" color="#6244BB" onSubmit={this.handleSubmit}>Login</button>
                                </form>
                                {renderError}
                                <br></br>
            Don't have an account? {<Link style={{ 'color': '#6244BB' }} to="/signup">Sign Up</Link>}
                                <br></br>
                            &copy; <em></em>Spartan Airline System
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Login