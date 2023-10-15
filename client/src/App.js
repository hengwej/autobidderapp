import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Routes, Route, Link } from "react-router-dom";
import Homepage from "./pages/General/homepage";
import FAQ from "./pages/General/faq";
import SignUp from "./pages/General/signup";
import Login from "./pages/General/login";
import Logout from "./pages/General/logout"; 
import SellCar from "./pages/Users/sell_a_car";
import ViewCarDetails from "./pages/Users/view_car_details";
import Placebid from "./pages/Users/placebid";
import "./css/styles.css";

function App() {
    /*const [showSignUpModal, setShowSignUpModal] = useState(false);*/
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);


    //const handleSignUpClose = () => setShowSignUpModal(false);
    //const handleSignUpShow = () => setShowSignUpModal(true);

    const handleLoginClose = () => setShowLoginModal(false);
    const handleLoginShow = () => setShowLoginModal(true);

    const handleLogoutClose = () => setShowLogoutModal(false);
    const handleLogoutShow = () => setShowLogoutModal(true);

    const handleLogoutConfirm = () => {
        // Handle the logout logic here
        // For example, clear the user's session or perform any necessary actions
        alert("Logging out..."); // You can replace this with your actual logout logic
        handleLogoutClose(); // Close the logout confirmation modal
    };

    return (
        <div className="App">
            <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
                <div class="container px-4 px-lg-5">
                    <a class="navbar-brand" href="#page-top" style={{ fontSize: 35 + 'px' }}>Auto Bid</a>
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <Link class="nav-link" to="/">Auctions</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" to="/faq">FAQ</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" to="/sellCar">Sell a Car</Link>
                        </li>
                        <li class="nav-item" style={{marginTop: 28 +'px'}}>
                            <Button variant="primary" onClick={handleLoginShow}>Login</Button>
                        </li>
                        <li class="nav-item" style={{ marginTop: -3 + 'px', marginLeft: 8 + 'px' }}>
                            <Link class="nav-link" to="/signup">
                                <Button variant="primary">Sign Up</Button>
                            </Link>
                        </li>

                        <li class="nav-item" style={{ marginTop: 28 + 'px', marginLeft: 16 + 'px' }}>
                            <Button variant="primary" onClick={handleLogoutShow}>Logout</Button>
                        </li>
                    </ul>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/sellCar" element={<SellCar />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout handleLogoutClose={handleLogoutClose} />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/viewCarDetails" element={<ViewCarDetails />} />
                <Route path="/placebid" element={<Placebid />} />
            </Routes>
            {/*<Modal show={showSignUpModal} onHide={handleSignUpClose}>*/}
            {/*    <Modal.Header closeButton>*/}
            {/*        <Modal.Title>Sign Up</Modal.Title>*/}
            {/*    </Modal.Header>*/}
            {/*    <Modal.Body>*/}
            {/*        <SignUp />*/}
            {/*    </Modal.Body>*/}
            {/*    <Modal.Footer>*/}
            {/*        <Button variant="secondary" onClick={handleSignUpClose}>*/}
            {/*            Close*/}
            {/*        </Button>*/}
            {/*    </Modal.Footer>*/}
            {/*</Modal>*/}
            <Modal show={showLoginModal} onHide={handleLoginClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Login />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleLoginClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showLogoutModal} onHide={handleLogoutClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Logout Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Do you want to logout?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleLogoutClose}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handleLogoutConfirm}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default App;