
import React from "react";
import Header from "../../../components/Header";
import "../../../css/styles.css";
import "./styles.css";


export default class FAQ extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            faqData: [],
            loading: true,
            error: null,
        };
    }

    async componentDidMount() {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/FAQ/getAllFAQs");

            if (!response.ok) {
                throw Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            this.setState({ faqData: data, loading: false });
        } catch (error) {
            console.error("Error fetching data:", error);
            this.setState({ error, loading: false });
        }
    }
    render() {
        const iconStyle = {
            fontSize: "24px",
            color: "black",
        };

        const contactInfoStyle = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
        };
        const centerText = {
            textAlign: "center",
        };

        const iconContainerStyle = {
            paddingRight: "10px",
        };

        const faqSectionStyle = {
            textAlign: "left",
            color: "black",
            maxHeight: "230px", // Set a fixed max height for the FAQ section
            overflowY: "auto", // Add vertical scroll if content exceeds the height
        };

        const faqQuestionTypeStyle = {
            fontWeight: "bold",
        };

        return (
            <div>

                <div className="header-container">
                    <a
                        style={{ fontSize: "25px", color: "black", display: "block", marginTop: "150px", marginBottom: "0", marginLeft: "20px" }}
                        className="navbar-brand"
                        href="#page-top"
                    >
                        Contact Us and FAQ
                    </a>
                    <Header headerText="Contact Us" />
                </div>
             
                <div className="contact-info-container" style={centerText}>
                    <p>If you are in need of assistance or for any general enquiries, please feel free to contact the number or email address below.</p>
                    <p>Operating hours for phone calls are from 9am-6pm.</p>
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
                </div>

                <div className="feedback-container" style={centerText}>
                    <p>Feedback</p>
                    <p>For feedback or suggestions, please email us at autobidFeedback@gmail.com</p>
                </div>

                <div className="faq-container" style={faqSectionStyle}>

                    <h2>FAQ Section</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Question Type</th>
                                <th>Answer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.faqData.map((faq, index) => (
                                <tr key={index}>
                                    <td style={faqQuestionTypeStyle}>{faq.questionType}</td>
                                    <td>{faq.questionAns}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
