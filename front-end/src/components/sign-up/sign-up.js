import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../config/config';
import expedia_image from '../images/expedia_logo.jpeg'
import cookie from "react-cookies";
export class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            email: '',
            password: '',
            gender: 'MALE',
            lastName: '',
            error: false,
            errorMessage: ""
        }
    }
    handlePasswordChange = inp => {
        this.setState({
            password: inp.target.value
        })

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
            console.log(inp.target.name);
            console.log(inp.target.value);
            this.setState({
                error: false,
                [inp.target.name]: inp.target.value
            })
        }
    }
    //handle input change
    handleEmailChange = inp => {
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
    handleSubmit = sub => {
        // to prevent refresh
        sub.preventDefault();
        const signUpUser ={
            firstName : this.state.firstName,
            lastName : this.state.lastName,
            gender : this.state.gender,
            email : this.state.email,
            password : this.state.password,
        }

        // if there is no error in the input, save the data in the local storage
        if(!this.state.error){
            axios
                .post(BACKEND_URL + '/users/signup', signUpUser)
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
                        cookie.save("miles", response.data.user.miles, {
                            path: '/',
                            httpOnly: false,
                            maxAge: 90000
                        })
                        cookie.save("token", response.data.token, {
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
                        if(response.data.user.role == 'ADMIN'){
                            window.location.assign('/admin-home');
                        }
                        else{
                            window.location.assign('/create-reservation')
                        }
                    }
                    else{
                        this.setState({
                            errorMessage: response.message,
                            error: true
                        })                       
                    }
                })
                .catch((err) => {
                    this.setState({
                        errorMessage: err.response.data.message,
                        error: true
                    })
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
                        <div className='row' style={{ "height": "10%" }}></div>
                        <div className='row' style={{ "height": "90%" }}>
                            <div className="col-12">
                                <h4 style={{ "margin": "10px", color: "#6244BB" }}>Sign Up for customer</h4>
                                <form onSubmit={this.handleSubmit} style={{ "margin": "10px" }} id="Signup">
                                    <div className="form-group">
                                        <input type="text" className="form-control" name="firstName" autoFocus required
                                            placeholder="Enter First Name" onChange={this.handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control" name="lastName" autoFocus required
                                            placeholder="Enter Last Name" onChange={this.handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control" name="email" type ="email" required
                                            placeholder="Enter Email" onChange={this.handleEmailChange} />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control" name="password" required
                                            placeholder="Enter Password" onChange={this.handlePasswordChange} />
                                    </div>
                                    <div className="role" style={{ "margin": "10px" }} onChange={this.handleInputChange}>
                                        <input type="radio" checked style={{ "margin": "0 5px" }} id='radio-b2' name="gender" value='MALE'
                                        />
                                        <label><h5>Male</h5></label>
                                        <input type="radio" style={{ "marginLeft": "15px", marginRight: "5px" }} id='radio-b1' name="gender" value='FEMALE'
                                        />
                                        <label><h5>Female</h5></label>                                    
                                        <input type="radio" style={{ "marginLeft": "15px", marginRight: "5px" }} id='radio-b1' name="gender" value='OTHER'
                                        />
                                        <label><h5>Other</h5></label>
                                    </div>
                                    <button type="submit" className="btn btn-warning" onSubmit={this.handleSubmit}>Sign Up</button>
                                </form>
                                {renderError}
                                <br></br>
                                Already have an account? {<Link style={{ 'color': '#6244BB' }} to="/login">Login</Link>}
                                <br></br>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Signup