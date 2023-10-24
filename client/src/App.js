import React from "react";
import { Routes, Route, Link } from "react-router-dom"; // Change 'BrowserRouter' to 'Routes'
import Homepage from "./pages/General/Homepage";
import FAQ from "./pages/General/FAQ";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
// import SellCar from "./pages/Users/SellACar/sell_a_car";
import SellCar from "./pages/Users/SellACar/sellcar";
import ViewCarDetails from "./pages/Users/CarDetails/view_car_details";
import Placebid from "./pages/Users/PlaceBid/placebid";
import Login2FA from "./pages/Auth/Login2FA";
import UserManagement from "./pages/Admin/ViewUsers/viewUsers";
import ViewDetails from "./pages/Admin/ViewUsers/view_user_details";
import Requests from "./pages/Admin/Requests/requests";
import ViewRequestDetails from "./pages/Admin/Requests/view_request_details";
import UserProfile from "./pages/Users/UserProfile/UserProfile";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import "./css/styles.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./utils/AuthProvider";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);


function App() {
    const { user, logout } = useAuth();

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
                        {user && (user.accountType === 'admin' || user.accountType === 'bidder') && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/sellCar">Sell a Car</Link>
                            </li>
                        )}
                        {!user && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/auth/login">Login</Link>
                            </li>
                        )}
                        {!user && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/signup">Sign Up</Link>
                            </li>
                        )}

                        {user && (user.accountType === 'admin' || user.accountType === 'bidder') && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/" onClick={logout}>Logout</Link>
                            </li>
                        )}
                        {user && (user.accountType === 'admin') && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/userManagement">Manage User</Link>
                            </li>
                        )}
                        {user && (user.accountType === 'admin') && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/Requests">Requests</Link>
                            </li>
                        )}
                        {user && (user.accountType === 'admin' || user.accountType === 'bidder') && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/userProfile">User Profile</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
            <Routes> {/* Use <Routes> instead of <Router> */}
                <Route path="/" element={<Homepage />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/sellCar" element={<SellCar />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/confirmation" element={<Login2FA />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/viewCarDetails/:carID" element={<Elements stripe={stripePromise}>
                    <ViewCarDetails />
                </Elements>} />
                <Route path="/placebid" element={<Elements stripe={stripePromise}>
                    <Placebid />
                </Elements>} />
                <Route
                    path="/userManagement"
                    element={
                        <ProtectedRoute allowedAccountTypes={['admin']}>
                            <UserManagement />
                        </ProtectedRoute>
                    }
                />
                <Route path="/userProfile" element={<UserProfile />} />
                <Route path="/viewUser/:userID" element={<ViewDetails />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/viewRequestDetails/:requestID" element={<ViewRequestDetails />} />
            </Routes>
        </div>
    );
}

export default App;