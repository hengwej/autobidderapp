import React, { Component } from "react";
import "../../css/styles.css";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../../components/Header";
import { Link } from "react-router-dom";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            carData: [], // Initialize an empty array to store car data
            timeLeft: {}
        };
    }

    // Simulated data fetching (replace with actual API call)
    componentDidMount() {
        // Simulate fetching car data from a database or API
        const fetchedData = [
            {
                id: 1,
                image: "car1.jpg",
                price: "$25,000",
                modelName: "Model X"
            },
            {
                id: 2,
                image: "car2.jpg",
                price: "$30,000",
                modelName: "Model S"
            },
            {
                id: 3,
                image: "car3.jpg",
                price: "$20,000",
                modelName: "Model 3"
            }
            // Add more car data here
        ];

        this.setState({ carData: fetchedData });

        this.calculateTimeLeft();
        this.startCountdown();
    }

    calculateTimeLeft = () => {
        const year = new Date().getFullYear();
        const difference = +new Date(`${year}-12-31`) - +new Date();
        let timeLeft = {};

        if (difference >= 0) {
            timeLeft = {
                /*days: Math.floor(difference / (1000 * 60 * 60 * 24)),*/
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        this.setState({ timeLeft });
    };

    startCountdown = () => {
        this.countdownInterval = setInterval(() => {
            this.calculateTimeLeft();
        }, 1000);
    };

    render() {
        const { timeLeft } = this.state;

        return (
            <div>
                <a
                    style={{ margin: "20px 20px 0",fontSize : "25px", color: "white" }}
                    className="navbar-brand"
                    href="#page-top"
                >
                    Auctions
                </a>

                <Header headerText="Welcome" />

                <div className="navbar navbar-expand-lg navbar-light" id="mainNav"></div>
                <Container fluid> {/* Use a fluid container for a full-width layout */}
                    <Row>
                        {this.state.carData.map((car) => (
                            <Col lg={4} key={car.id}> {/* Use lg for larger column widths */}
                                <Link to={`/viewCarDetails`} style={{ textDecoration: "none" }}> {/* Specify the target route */}
                                    <Card>
                                        <Card.Img src={car.image} alt={car.modelName} />
                                        <Card.Body>
                                            <Card.Title>{car.modelName}</Card.Title>
                                            <Card.Text>Price: {car.price}</Card.Text>
                                            <Card.Text class="bar-bg">
                                                {Object.keys(timeLeft).map((interval) => (
                                                    <span key={interval}>
                                                        {timeLeft[interval]} {interval !== "seconds" && ":"}
                                                    </span>
                                                ))}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        );
    }
}
