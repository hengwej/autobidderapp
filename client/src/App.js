import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Homepage from "./pages/General/Homepage";
import FAQ from "./pages/General/FAQ";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import Logout from "./pages/Auth/Logout";
import SellCar from "./pages/Users/SellACar/sell_a_car";
import ViewCarDetails from "./pages/Users/CarDetails/view_car_details";
import Placebid from "./pages/Users/PlaceBid/placebid";
import "./css/styles.css";
import Login2FA from "./pages/Auth/Login2FA";


function App() {

    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
                <div className="container px-4 px-lg-5">
                    <a className="navbar-brand" href="/" style={{ fontSize: 35 + 'px' }}>Auto Bid</a>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Auctions</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/faq">FAQ</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/sellCar">Sell a Car</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/auth/login">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/signup">Sign Up</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/logout">Logout</Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/sellCar" element={<SellCar />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/confirmation" element={<Login2FA />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/viewCarDetails/:carID" element={<ViewCarDetails />} />
                <Route path="/placebid" element={<Placebid />} />
            </Routes>
        </div>
    );
}

export default App;