import React, { useEffect, useState } from "react";
import "../../css/styles.css";
import { Modal, Button } from "react-bootstrap";
import Placebid from "./placebid";
import { useParams } from "react-router-dom";

export default function ViewCarDetails() {
    const { carID } = useParams();
    const [carData, setCarData] = useState({});
    const [timeLeft, setTimeLeft] = useState({});
    const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);
    const [error, setError] = useState(null);
    
    const handlePlaceBidClose = () => {
        setShowPlaceBidModal(false);
    };

    const handlePlaceBidShow = () => {
        setShowPlaceBidModal(true);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("http://localhost:5000/");
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

            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error);
            }
        }

        fetchData();
    }, { carID });

    const calculateTimeLeft = () => {
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

        setTimeLeft(timeLeft);
    };

    const startCountdown = () => {
        this.countdownInterval = setInterval(() => {
            calculateTimeLeft();
        }, 1000);
    };

    return (
        <div class="wrapper">
            <div class="timer">
                Time Left:{" "}
                {Object.keys(timeLeft).map((interval) => (
                    <span key={interval}>
                        {timeLeft[interval]} {interval}{" "}
                    </span>
                ))}
            </div>

            <Button variant="warning" onClick={handlePlaceBidShow} style={{ marginLeft: 568 + 'px', padding: 8 + 'px' }}>
                Place Bid
            </Button>
            <Modal show={showPlaceBidModal} onHide={handlePlaceBidClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Place Bid</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Placebid />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handlePlaceBidClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <table key={carData.carID}>
                <tr>
                    <th style={{ width: 180 + 'px', borderRight: "2px solid white" }}>Make</th>
                    <td style={{ width: 500 + 'px' }}>{carData.make}</td>
                </tr>
                <tr>
                    <th style={{ borderRight: "2px solid white" }}>Model</th>
                    <td>{carData.model}</td>
                </tr>
                <tr>
                    <th style={{ borderRight: "2px solid white" }}>Interior Color</th>
                    <td>{carData.interiorColor}</td>
                </tr>
                <tr>
                    <th style={{ borderRight: "2px solid white" }}>Exterior Color</th>
                    <td>{carData.exteriorColor}</td>
                </tr>
            </table>

            <div key={carData.carID}>
                <div>
                    <label class="cardetails_label" style={{ marginTop: 30 + 'px' }}>Highlights</label>
                    <hr class="solid" />
                    <ul class="carDetailUl">
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
                    <label class="cardetails_label">Equipment</label>
                    <hr class="solid" />
                    <ul class="carDetailUl">
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
                    <label class="cardetails_label">Modifications</label>
                    <hr class="solid" />
                    <ul class="carDetailUl">
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
                    <label class="cardetails_label">Known Flaws</label>
                    <hr class="solid" />
                    <ul class="carDetailUl">
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

            <div>
                <label class="cardetails_label">Comments</label><br />
                <input type="text" id="comment" name="comment" size="70" class="inputComment" />
                <Button variant="info" style={{ marginLeft: 20 + 'px', marginBottom: 6 + 'px', padding: 8 + 'px', width: 100 + 'px' }}>
                    Add
                </Button>
            </div>
        </div>
    );
}