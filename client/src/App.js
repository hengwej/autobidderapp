import { Routes, Route, Link } from "react-router-dom";
import Homepage from "./pages/General/homepage";
import FAQ from "./pages/General/faq";
import SellCar from "./pages/Users/sell_a_car";
import "./css/styles.css";

function App() {
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
                            <a class="btn btn-primary" href="#about">Login</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/sellCar" element={<SellCar />} />
            </Routes>
        </div>
    );
}

export default App;