import React, { useEffect, useState } from "react";
import "./styles.css";
import { Modal, Button } from "react-bootstrap";
import Placebid from "../PlaceBid/placebid";
import { useParams } from "react-router-dom";

export default function ViewCarDetails() {
    const { carID } = useParams();
    const [carData, setCarData] = useState({});
    const [timeLeft, setTimeLeft] = useState({});
    const [showPlaceBidModal, setShowPlaceBidModal] = useState(false);
    const [error, setError] = useState(null);
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

            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error);
            }
        }

        fetchData();
    }, [ carID ]);

    useEffect(() => {
        if (carData && carData.createdAt) {
            calculateTimeLeft();
            startCountdown();
        }
    }, [carData]);

    //const calculateTimeLeft = () => {
    //    const dateString = carData.createdAt;
    //    console.log("date " + carData.createdAt);
    //    const startDate = new Date(dateString);
    //    const endDate = new Date(startDate);
    //    endDate.setDate(endDate.getDate() + 7);
    //    const currentDate = new Date();
    //    const difference = endDate - startDate;
    //    let timeLeft = {};

    //    if (currentDate < startDate) {
    //        console.log('The event has not started yet.');
    //    } else if (currentDate >= startDate && currentDate <= endDate) {
    //        timeLeft = {
    //            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    //            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    //            minutes: Math.floor((difference / (1000 * 60)) % 60),
    //            seconds: Math.floor((difference / 1000) % 60)
    //        };
    //    }
    //    else {
    //        console.log('The event has ended.');
    //    }
    //    //if (difference >= 0) {
            
    //    //}

    //    setTimeLeft(timeLeft);
    //};

    const calculateTimeLeft = () => {
        const dateString = carData.createdAt;
        const startDate = new Date(dateString);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);
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

    return (
        <div class="wrapper">
            <div key={carData.carID}>
                <label class="cardetails_label">{carData.make}&nbsp;{carData.model}</label><br />
                {carData && carData.carImage && carData.carImage.data && (
                    <img src={URL.createObjectURL(new File([new Blob([new Uint8Array(carData.carImage.data)])], { type: 'image/jpeg' }))} class="carImages" />
                )}
            </div>

            <div class="timer">
                <b>Time Left:</b>{" "}
                {Object.keys(timeLeft).map((interval) => (
                    <span key={interval}>
                        {timeLeft[interval]} {interval}{" "}
                    </span>
                ))}
                <b>Last Bid ($)</b>
                <span>500</span>
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