import React, { useEffect, useState } from "react";
import "./styles.css";
import { Modal, Button, Container } from "react-bootstrap";
import Placebid from "../PlaceBid/placebid";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../utils/AuthProvider";

export default function ViewCarDetails() {
    const { carID } = useParams();
    const [carData, setCarData] = useState({});
    const [timeLeft, setTimeLeft] = useState({});
    const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);
    const [error, setError] = useState(null);
    const [currentHighestBid, setCurrentHighestBid] = useState(null);
    const [auctionStartDate, setAuctionStartDate] = useState(null);
    const [auctionEndDate, setAuctionEndDate] = useState(null);
    const [auctionID, setAuctionID] = useState(null);
    const [carCommentData, setCarCommentData] = useState(null);
    const [accountID, setAccountID] = useState(null);
    const [userName, setUserName] = useState(null);
    const { user } = useAuth();
    let countdownInterval;

    const handlePlaceBidClose = () => {
        setShowPlaceBidModal(false);
    };

    const handlePlaceBidShow = () => {
        setShowPlaceBidModal(true);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/cars/allCar");
                const data = await response.json();
                console.log(data);
                const car = data.find((car) => car.carID === parseInt(carID));
                console.log("Extracted carID:", typeof carID);
                if (car) {
                    console.log("Data for ID", carID, ":", car);
                    setCarData(car);
                    calculateTimeLeft();
                    startCountdown();
                } else {
                    console.log("Data not found for ID", carID);
                }

                const auctionResponse = await fetch("http://127.0.0.1:5000/api/auctions/allAuction");
                const auctionData = await auctionResponse.json();
                const auction = auctionData.find((auction) => parseInt(carID) === auction.carID);
                setCurrentHighestBid(auction.currentHighestBid);
                setAuctionStartDate(auction.startDate);
                setAuctionEndDate(auction.endDate);

                const commentResponse = await fetch("http://127.0.0.1:5000/api/comments/allComment");
                const commentData = await commentResponse.json();
                const comment = commentData.find((comment) => auction.auctionID === comment.auctionID);
                setCarCommentData(comment.details);

                const accountResponse = await fetch("http://127.0.0.1:5000/api/accounts/allAccount");
                const accountData = await accountResponse.json();
                const account = accountData.find((account) => comment.accountID === account.accountID);
                setUserName(account.username);

            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error);
            }
        }

        fetchData();
    }, [carID]);

    useEffect(() => {
        if (carData && carData.createdAt) {
            calculateTimeLeft();
            startCountdown();
        }
    }, [carData]);

    const calculateTimeLeft = () => {
        const startDate = new Date(auctionStartDate);
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

    //const addComment = () => {
    //    // Get the input value using the ref
    //    const commentValue = commentInputRef.current.value;

    //    // Make sure the input is not empty before posting to the server
    //    if (commentValue.trim() !== '') {
    //        axios.post(`http://127.0.0.1:5000/api/comments/addComment`, { comment: commentValue, auctionID: auctionID }, { withCredentials: true })
    //            .then(res => {
    //            })
    //            .catch(error => {
    //                console.error("Failed to comment:", error);
    //            });
    //    }

    //    // Clear the input field
    //    commentInputRef.current.value = '';
    //}

    return (
        <Container>
            <div className="wrapper">
                <div className="flex-container">
                    <div key={carData.carID}>
                        <label className="cardetails_label">{carData.make}&nbsp;{carData.model}</label><br />
                        <div className="carDetails">
                            {carData && carData.carImage && carData.carImage.data && (
                                <img src={URL.createObjectURL(new File([new Blob([new Uint8Array(carData.carImage.data)])], { type: 'image/jpeg' }))} className="carImages" />
                            )}
                        </div>
                    </div>

                    <table className="side-table" key={carData.carID}>
                        <tr>
                            <th style={{ width: 180 + 'px', borderRight: "2px solid black" }}>Vehicle Number</th>
                            <td style={{ width: 500 + 'px' }}>{carData.vehicleNumber}</td>
                        </tr>
                        <tr>
                            <th style={{ width: 180 + 'px', borderRight: "2px solid black" }}>Make</th>
                            <td>{carData.make}</td>
                        </tr>
                        <tr>
                            <th style={{ borderRight: "2px solid black" }}>Model</th>
                            <td>{carData.model}</td>
                        </tr>
                        <tr>
                            <th style={{ borderRight: "2px solid black" }}>Interior Color</th>
                            <td>{carData.interiorColor}</td>
                        </tr>
                        <tr>
                            <th style={{ borderRight: "2px solid black" }}>Exterior Color</th>
                            <td>{carData.exteriorColor}</td>
                        </tr>
                    </table>
                </div>



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

                {user && (user.accountType === 'admin' || user.accountType === 'bidder') && (
                    <Button variant="warning" onClick={handlePlaceBidShow} style={{ marginLeft: 585 + 'px', padding: 8 + 'px' }}>
                        Place Bid
                    </Button>
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