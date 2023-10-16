import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Homepage from "./pages/General/Homepage";
import FAQ from "./pages/General/FAQ";
import SignUp from "./pages/General/SignUp";
import Login from "./pages/General/Login";
import Logout from "./pages/General/Logout";
import SellCar from "./pages/Users/SellACar/sell_a_car";
import ViewCarDetails from "./pages/Users/CarDetails/view_car_details";
import Placebid from "./pages/Users/PlaceBid/placebid";
import "./css/styles.css";


function App() {

    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
                <div className="container px-4 px-lg-5">
                    <a className="navbar-brand" href="#page-top" style={{ fontSize: 35 + 'px' }}>Auto Bid</a>
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
                            <Link className="nav-link" to="/login">Login</Link>
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
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/viewCarDetails" element={<ViewCarDetails />} />
                <Route path="/placebid" element={<Placebid />} />
            </Routes>
        </div>
    );
}

export default App;