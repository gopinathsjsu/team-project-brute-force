import React, { Component } from 'react';
import Login from './login/login';
import Signup from './sign-up/sign-up';
import Navbar from './navbar/navbar';
import { Route } from 'react-router-dom';
import { Logout } from './login/logout';
import { PurchaseSeats } from './flights/purchase-seats';
import AdminHome from './admin/admin-home';
import AddFlights from './admin/add-flights';
import BookFlights from './flights/book-flights';
import AllFlights from './admin/all-flights';
import ViewAllReservations from './admin/view-all-reservations';
import ViewUpcomingReservations from './flights/view-upcoming-reservations';

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
                <Route path='/purchase-seats/:flight/:quantity/:mileoption/:price' component={PurchaseSeats} />
                
                <Route path='/admin-home' component={ AdminHome } />
                <Route path='/addflights' component={ AddFlights } />
                <Route path='/admin' component={ AdminHome } />
                <Route path='/create-flight' component={ AddFlights } />
                <Route path='/all-flights' component={ AllFlights } />
                <Route path='/create-reservation' component={ BookFlights } />
                <Route path='/view-all-reservations' component={ ViewAllReservations } />
                <Route path='/upcoming-reservations' component={ ViewUpcomingReservations } />
            </div>
        )
    }
}

export default Main;