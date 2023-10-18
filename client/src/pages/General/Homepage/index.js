import React, { Component } from "react";
import "../../../css/styles.css";
import "./styles.css";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../../../components/Header";
import { Link } from "react-router-dom";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            carData: [], // Initialize an empty array to store car data
            timeLeft: {}
        };
    }

    async componentDidMount() {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/cars/allCar");
            const data = await response.json();
            
            this.setState({ carData: data, loading: false });

            this.calculateTimeLeft();
            this.startCountdown();
        } catch (error) {
            console.error("Error fetching data:", error);
            this.setState({ error, loading: false });
        }
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
        if (this.state.loading) return <div>Loading...</div>;
        if (this.state.error) return <div>Error: {this.state.error.message}</div>;

        return (
            <div>
                <a
                    style={{ margin: "20px 20px 0", fontSize: "25px", color: "white" }}
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
                            <Col lg={4} key={car.carID}> {/* Use lg for larger column widths */}
                                <Link to={`/viewCarDetails/${car.carID}`} style={{ textDecoration: "none" }}> {/* Specify the target route */}
                                    <Card>
                                        <Card.Img src={URL.createObjectURL(new File([new Blob([new Uint8Array(car.carImage.data)])], { type: 'image/jpeg' }))} alt={car.model} />
                                        <Card.Body>
                                            <Card.Title>{car.make} {car.model}</Card.Title>
                                            <Card.Text>Price: ${car.startingBid}</Card.Text>
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
