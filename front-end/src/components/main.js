import React, { Component } from 'react';
import Login from './login/login';
import Signup from './sign-up/sign-up';
import Navbar from './navbar/navbar';
import { Route } from 'react-router-dom';
import { Logout } from './login/logout';
import { PurchaseSeats } from './flights/purchase-seats';
import AdminHome from './admin/admin-home';

export class Main extends Component {
    render() {
        return (
            <div>
                <Route exact path='/' component={Login} />
                <Route path='/' component={Navbar} />
                <Route path='/login' component={Login} />
                <Route path='/signup' component={Signup} />
                <Route path='/navbar' component={Navbar} />
                <Route path='/logout' component={Logout} />
                <Route path='/admin' component={ AdminHome } />
            </div>
        )
    }
}

export default Main;