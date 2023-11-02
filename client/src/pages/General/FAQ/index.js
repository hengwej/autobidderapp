
import React from "react";
import Header from "../../../components/Header";
import "../../../css/styles.css";
import "./styles.css";
import Container from "react-bootstrap/Container";
import * as faqAPI from "../../../utils/FaqAPI.js"

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
            const response = await faqAPI.getAllFAQs();
            if (response.status === 200) {
                const data = await response.data;
                this.setState({ faqData: data, loading: false });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            this.setState({ error, loading: false });
        }
    }
    render() {

        return (

            <Container>
                <div className="main-container">
                    <div className="header-container">
                        <h2>Contact Us and FAQ</h2>
                        <Header headerText="Contact Us"/>
                    </div>

                    <div className="contact-info-container">
                        <p>If you are in need of assistance or for any general enquiries, please feel free to contact the number or email address below.</p>
                        <p>Operating hours for phone calls are from 9am-6pm.</p>
                        <div className="contact-info">
                            <div className="icon-container">
                                <i className="fas fa-phone"></i>
                            </div>
                            <div>
                                <p>+65 1234 5678</p>
                            </div>
                        </div>
                        <div className="contact-info">
                            <div className="icon-container">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <div>
                                <p>autobid@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="feedback-container">
                        <p>Feedback</p>
                        <p>For feedback or suggestions, please email us at autobidFeedback@gmail.com</p>
                    </div>

                    <div className="faq-container">
                        <h2>FAQ Section</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{color: 'orangered'}}>Question Type</th>
                                    <th style={{ color: 'orangered' }}>Answer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.faqData.map((faq, index) => (
                                    <tr key={index}>
                                        <td className="faq-question-type">{faq.questionType}</td>
                                        <td>{faq.questionAns}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Container>



        );
    }
}
