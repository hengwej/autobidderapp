import React, { Component } from "react";
import "./styles.css";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import * as auctionAPI from "../../../utils/AuctionAPI";
import * as carAPI from "../../../utils/CarAPI";
import * as bidAPI from "../../../utils/BidAPI";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.countdownInterval = null;
        this.state = {
            carData: [], // Initialize an empty array to store car data
            timeLeft: {},
            auctionData: []
        };
    }

    async componentDidMount() {
        try {
            const carResponse = await carAPI.getAllCars();
            const data = carResponse.data;

            this.setState({ carData: data, loading: false });

            const auctionResponse = await auctionAPI.getAllAuctions();
            const retrieveAuctionData = auctionResponse.data;

            this.setState({ auctionData: retrieveAuctionData, loading: false });

            // Initialize timers for each car
            const initialTimers = {};
            retrieveAuctionData.forEach((auctionItem) => {
                const auction = retrieveAuctionData.find((auctionItem) => data.carID === auctionItem.carID);

                if (auction) {
                    initialTimers[auctionItem.carID] = this.calculateTimeLeft(
                        new Date(auction.startDate),
                        new Date(auction.endDate),
                        auctionItem.auctionID
                    );;
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
        const auctionEndDate = new Date(endDate);
        const currentDate = new Date();
        const difference = auctionEndDate - currentDate;
        let timeLeft = {};

        if (difference > 0) {
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
            let auctionsToUpdate = [];

            auctionData.forEach((auction) => {
                const timer = this.calculateTimeLeft(auction.startDate, auction.endDate);
                updatedTimers[auction.carID] = timer;

                // Check if the auction has just completed
                if (this.isAuctionJustCompleted(timer, timeLeft[auction.carID])) {
                    auctionsToUpdate.push(auction.auctionID);
                }
            });

            this.setState({ timeLeft: updatedTimers }, () => {
                auctionsToUpdate.forEach((auctionID) => {
                    this.handleAuctionCompletion(auctionID);
                });
            });
        }, 1000);
    };

    isAuctionJustCompleted = (currentTimer, previousTimer) => {
        // Check if the auction was running in the previous check and has now completed
        return previousTimer && Object.values(previousTimer).some(val => val > 0) && !Object.values(currentTimer).some(val => val > 0);
    };

    handleAuctionCompletion = (auctionID) => {
        // Check if this auctionID is already processed to prevent multiple updates
        if (this.state.auctionData.some(auction => auction.auctionID === auctionID && auction.isCompleted)) {
            return;
        }

        // Mark the auction as completed to prevent future updates
        this.setState(prevState => ({
            auctionData: prevState.auctionData.map(auction =>
                auction.auctionID === auctionID ? { ...auction, isCompleted: true } : auction
            )
        }));

        // Update to bidding status to end
        const bidData = { status: "Ended", auctionID: auctionID };
        bidAPI.updateBidHistoryToEnd(bidData);

        // Update to auction status to closed
        const updateData = { status: "CLOSED", auctionID: auctionID };
        auctionAPI.updateAuctionToClose(updateData);

        // Update the orderStatus to completed in order table
        const orderData = { orderStatus: 'Completed', auctionID: auctionID };
        auctionAPI.completeOrder(orderData);
    };

    render() {
        const { carData, timeLeft } = this.state;
        if (this.state.loading) return <div>Loading...</div>;
        if (this.state.error) return <div>Error: {this.state.error.message}</div>;

        // Filter out cars whose timers have not ended
        const activeCars = carData.filter((car) => {
            const timer = timeLeft[car.carID];
            return timer && timer.days >= 0;
        });

        return (
            <div>
                <Container>
                    <Row>
                        {activeCars.map((car) => (
                            <Col lg={4} key={car.carID}> {/* Use lg for larger column widths */}
                                <Link to={`/viewCarDetails/${car.carID}`} style={{ textDecoration: "none" }}> {/* Specify the target route */}
                                    <Card className="carCard" style={{ height: 400 + 'px' }}>
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