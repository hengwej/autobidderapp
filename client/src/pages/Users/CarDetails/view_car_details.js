import React, { useEffect, useState } from "react";
import "./styles.css";
import { Modal, Button, Container } from "react-bootstrap";
import Placebid from "../PlaceBid/placebid";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../utils/AuthProvider";
import * as carAPI from "../../../utils/CarAPI";
import * as auctionAPI from "../../../utils/AuctionAPI";
import * as accountAPI from "../../../utils/AccountAPI";

export default function ViewCarDetails() {
    const { carID } = useParams();
    const [carData, setCarData] = useState({});
    const [timeLeft, setTimeLeft] = useState({});
    const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);
    const [currentHighestBid, setCurrentHighestBid] = useState(null);
    const [auctionEndDate, setAuctionEndDate] = useState(null);
    const [setUserName] = useState(null);
    const { user } = useAuth();

    const handlePlaceBidClose = () => {
        setShowPlaceBidModal(false);
    };

    const handlePlaceBidShow = () => {
        setShowPlaceBidModal(true);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const [carResponse, auctionResponse, accountResponse] = await Promise.all([
                    carAPI.getAllCars(),
                    auctionAPI.getAllAuctions(),
                    accountAPI.allAccount()
                ]);

                const carData = await carResponse.data;
                const auctionData = await auctionResponse.data;
                const accountData = await accountResponse.data;

                const car = carData.find((car) => car.carID === parseInt(carID));

                if (car) {
                    setCarData(car);
                } else {
                    console.log("Data not found for ID", carID);
                }

                const auction = auctionData.find((auction) => parseInt(carID) === auction.carID);

                if (auction) {
                    setCurrentHighestBid(auction.currentHighestBid);
                    setAuctionEndDate(auction.endDate);
                } else {
                    console.log("Auction not found for carID: " + carID);
                }

                const account = accountData.find((account) => account.accountID);
                setUserName(account.username);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [carID, setUserName]);

    useEffect(() => {
        let countdownInterval;
        const calculateTimeLeft = () => {
            const endDate = new Date(auctionEndDate);
            const currentDate = new Date();


            const difference = endDate - currentDate;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / (1000 * 60)) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeLeft({
                    days,
                    hours,
                    minutes,
                    seconds,
                });
            } else {
                clearInterval(countdownInterval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                console.log('The event has ended.');
            }
        };

        const startCountdown = () => {
            countdownInterval = setInterval(() => {
                calculateTimeLeft();
            }, 1000);
        };

        if (carData && carData.createdAt) {
            calculateTimeLeft();
            startCountdown();
        }
    }, [carData, auctionEndDate]);

    return (
        <Container>
            <div className="wrapper">
                <div className="flex-container">
                    <div key={carData.carID}>
                        <label className="cardetails_label">{carData.make}&nbsp;{carData.model}</label><br />
                        <div className="carDetails">
                            {carData && carData.carImage && carData.carImage.data && (
                                <img src={URL.createObjectURL(new File([new Blob([new Uint8Array(carData.carImage.data)])], { type: 'image/jpeg' }))} className="carImages" alt="" />
                            )}
                        </div>
                    </div>


                    <div className="side-table">
                        <table>
                            <tbody>
                                <tr>
                                    <th className="table-header" style={{ borderRight: '2px solid black' }}>Vehicle Number</th>
                                    <td className="table-cell" style={{ width: '500px' }}>{carData.vehicleNumber}</td>
                                </tr>

                                <tr>
                                    <th className="table-header" style={{ borderRight: '2px solid black' }}>Make</th>
                                    <td className="table-cell">{carData.make}</td>
                                </tr>
                                <tr>
                                    <th className="table-header" style={{ borderRight: '2px solid black' }}>Model</th>
                                    <td className="table-cell">{carData.model}</td>
                                </tr>
                                <tr>
                                    <th className="table-header" style={{ borderRight: '2px solid black' }}>Interior Color</th>
                                    <td className="table-cell">{carData.interiorColor}</td>
                                </tr>
                                <tr>
                                    <th className="table-header" style={{ borderRight: '2px solid black' }}>Exterior Color</th>
                                    <td className="table-cell">{carData.exteriorColor}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                </div>

                {user ? (
                    user.accountType === 'admin' || user.accountType === 'bidder' ? (
                        <>
                            <div className="timer">
                                <b>Time Left:</b>{" "}
                                {Object.keys(timeLeft).map((interval) => (
                                    <span key={interval}>
                                        {timeLeft[interval]} {interval}{" "}
                                    </span>
                                ))}
                                <b>High Bid($) </b>
                                <span>{currentHighestBid}</span>
                            </div>
                            <Button variant="warning" onClick={handlePlaceBidShow} style={{ marginLeft: '585px', padding: '8px' }}>
                                Place Bid
                            </Button>
                        </>
                    ) : (
                        <div className="timerNoLogin">
                            <b>Time Left:</b>{" "}
                            {Object.keys(timeLeft).map((interval) => (
                                <span key={interval}>
                                    {timeLeft[interval]} {interval}{" "}
                                </span>
                            ))}
                            <b>High Bid($) </b>
                            <span>{currentHighestBid}</span>
                        </div>
                    )
                ) : (
                    <div className="timerNoLogin">
                        <b>Time Left:</b>{" "}
                        {Object.keys(timeLeft).map((interval) => (
                            <span key={interval}>
                                {timeLeft[interval]} {interval}{" "}
                            </span>
                        ))}
                        <b>High Bid($) </b>
                        <span>{currentHighestBid}</span>
                    </div>
                )}

                <Modal show={showPlaceBidModal} onHide={handlePlaceBidClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Place Bid</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Placebid carID={carData.carID} handleClose={handlePlaceBidClose} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handlePlaceBidClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>



                <div key={carData.carID}>
                    <div>
                        <label className="cardetails_label" style={{ marginTop: 30 + 'px' }}>Highlights</label>
                        <hr className="solid" />
                        <ul className="carDetailUl">
                            {carData.highlights ? (
                                carData.highlights.split('\n').map((highlight, index) => (
                                    <li key={index}>{highlight}</li>
                                ))
                            ) : (
                                <li>No highlights available.</li>
                            )}
                        </ul>
                    </div>

                    <div>
                        <label className="cardetails_label">Equipment</label>
                        <hr className="solid" />
                        <ul className="carDetailUl">
                            {carData.equipment ? (
                                carData.equipment.split('\n').map((equipment, index) => (
                                    <li key={index}>{equipment}</li>
                                ))
                            ) : (
                                <li>No equipment available.</li>
                            )}
                        </ul>
                    </div>

                    <div>
                        <label className="cardetails_label">Modifications</label>
                        <hr className="solid" />
                        <ul className="carDetailUl">
                            {carData.modifications ? (
                                carData.modifications.split('\n').map((modification, index) => (
                                    <li key={index}>{modification}</li>
                                ))
                            ) : (
                                <li>No modifications available.</li>
                            )}
                        </ul>
                    </div>

                    <div>
                        <label className="cardetails_label">Known Flaws</label>
                        <hr className="solid" />
                        <ul className="carDetailUl">
                            {carData.knownFlaws ? (
                                carData.knownFlaws.split('\n').map((knownflaw, index) => (
                                    <li key={index}>{knownflaw}</li>
                                ))
                            ) : (
                                <li>No known flaws available.</li>
                            )}
                        </ul>
                    </div>
                </div>

            </div>
        </Container>
    );
}
