import React, { Component } from "react";
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
            timeLeft: {},
            auctionData: []
        };
    }

    async componentDidMount() {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/cars/allCar");
            const data = await response.json();

            this.setState({ carData: data, loading: false });

            const auctionResponse = await fetch("http://127.0.0.1:5000/api/auctions/allAuction");
            const retrieveAuctionData = await auctionResponse.json();
            this.setState({ auctionData: retrieveAuctionData, loading: false });

            // Initialize timers for each car
            const initialTimers = {};
            retrieveAuctionData.forEach((auctionDate) => {
                const auction = retrieveAuctionData.find((auctionDate) => data.carID === auctionDate.carID);
                if (auction) {
                    initialTimers[auctionDate.carID] = this.calculateTimeLeft(
                        new Date(auction.startDate),
                        new Date(auction.endDate)
                    );
                }
            });
            this.setState({ timeLeft: initialTimers });

            this.startCountdown();
        } catch (error) {
            console.error("Error fetching data:", error);
            this.setState({ error, loading: false });
        }
    }

    calculateTimeLeft = (startDate, endDate) => {
        const auctionStartDate = new Date(startDate);
        const auctionEndDate = new Date(endDate);
        const currentDate = new Date();
        const difference = auctionEndDate - currentDate;
        let timeLeft = {};

        if (difference >= 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;
    };

    startCountdown = () => {
        this.countdownInterval = setInterval(() => {
            const { auctionData, timeLeft } = this.state;
            const updatedTimers = { ...timeLeft };

            auctionData.forEach((auction) => {
                const timer = this.calculateTimeLeft(auction.startDate, auction.endDate);
                updatedTimers[auction.carID] = timer;
            });

            this.setState({ timeLeft: updatedTimers });
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

                <Container fluid> {/* Use a fluid container for a full-width layout */}
                    <Row>
                        {this.state.carData.map((car) => (
                            <Col lg={4} key={car.carID}> {/* Use lg for larger column widths */}
                                <Link to={`/viewCarDetails/${car.carID}`} style={{ textDecoration: "none" }}> {/* Specify the target route */}
                                    <Card style={{ height: 400 + 'px' }}>
                                        <Card.Img src={URL.createObjectURL(new File([new Blob([new Uint8Array(car.carImage.data)])], { type: 'image/jpeg' }))} alt={car.model} />
                                        <Card.Body>
                                            <Card.Title>{car.make} {car.model}</Card.Title>
                                            <Card.Text>Price: ${car.startingBid}</Card.Text>
                                            <Card.Text className="bar-bg">
                                                {Object.keys(timeLeft[car.carID] || {}).map((interval) => (
                                                    <span key={interval}>
                                                        {timeLeft[car.carID][interval]} {interval !== "seconds" && ":"}
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