
import React from "react";
import Header from "../../components/Header";

export default class FAQ extends React.Component {
    render() {
        const iconStyle = {
            fontSize: "24px",
            color: "white",
        };

        const contactInfoStyle = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
        };

        const iconContainerStyle = {
            paddingRight: "10px",
        };

        const faqStyle = {
            textAlign: "center",
            color: "white",
        };
        const dropdownStyle = {
            marginTop: "20px", // Add margin at the top to separate the dropdowns
        };

        return (
            <div>
                <a
                    style={{ margin: "20px 20px 0", fontSize: "25px", color: "white" }}
                    className="navbar-brand"
                    href="#page-top"
                >
                    Contact Us and FAQ
                </a>
                <Header headerText="Contact Us" />

                <div style={{ padding: "20px", textAlign: "center", color: "white" }}>
                    <p>If you are in need of assistance or for any general enquiries, please feel free to contact us using the information below.</p>
                    <p>Operating hours for phone calls are from 9am-6pm.</p>
                </div>

                <div style={contactInfoStyle}>
                    <div style={iconContainerStyle}>
                        <i className="fas fa-phone" style={iconStyle}></i>
                    </div>
                    <div>
                        <p>+65 1234 5678</p>
                    </div>
                </div>
                <div style={contactInfoStyle}>
                    <div style={iconContainerStyle}>
                        <i className="fas fa-envelope" style={iconStyle}></i>
                    </div>
                    <div>
                        <p>autobid@gmail.com</p>
                    </div>
                </div>

                <div style={{ padding: "20px", textAlign: "center", color: "white" }}>
                    <p>Feedback</p>
                    <p>For feedback or suggestions, please email us at autobidFeedback@gmail.com</p>
                </div>

                <div style={faqStyle}>
                    <h2>FAQ Section</h2>
                    <div className="dropdown" style={dropdownStyle}>
                        <button className="btn btn-primary dropdown-toggle" type="button" id="buyerDropdown" data-toggle="dropdown">
                            Buyer
                        </button>
                        <div className="dropdown-menu" aria-labelledby="buyerDropdown">
                            {/* Add FAQ items for buyers here */}
                        </div>
                    </div>

                    <div className="dropdown" style={dropdownStyle}>
                        <button className="btn btn-primary dropdown-toggle" type="button" id="sellerDropdown" data-toggle="dropdown">
                            Seller
                        </button>
                        <div className="dropdown-menu" aria-labelledby="sellerDropdown">
                            {/* Add FAQ items for sellers here */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
