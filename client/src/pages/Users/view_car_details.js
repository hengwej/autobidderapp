import React, { Component } from "react";
import "../../css/styles.css";
import { Modal, Button } from "react-bootstrap";
import Placebid from "./placebid";

export default class CarDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPlaceBidModal: false,
            carData: [], // Initialize an empty array to store car data
            timeLeft: {}
        };
    }

    handlePlaceBidClose = () => {
        this.setState({ showPlaceBidModal: false });
    };

    handlePlaceBidShow = () => {
        this.setState({ showPlaceBidModal: true });
    };

    // Simulated data fetching (replace with actual API call)
    componentDidMount() {
        // Simulate fetching car data from a database or API
        const fetchedData = [
            {
                id: 1,
                make: "BMW",
                modelName: "Model X",
                interiorColor: "Gray",
                exteriorColor: "Black"
            },
            //{
            //    id: 2,
            //    make: "Nissan",
            //    modelName: "Model X",
            //    interiorColor: "Gray",
            //    exteriorColor: "Red"
            //},
            //{
            //    id: 3,
            //    make: "Toyota",
            //    modelName: "Model X",
            //    interiorColor: "Gray",
            //    exteriorColor: "Sliver"
            //}
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
                <div class="timer">
                    Time Left:{" "}
                    {Object.keys(timeLeft).map((interval) => (
                        <span key={interval}>
                            {timeLeft[interval]} {interval}{" "}
                        </span>
                    ))}
                </div>

                <Button variant="warning" onClick={this.handlePlaceBidShow} style={{ marginLeft: 568 + 'px', padding: 8 + 'px' }}>
                    Place Bid
                </Button>
                <Modal show={this.state.showPlaceBidModal} onHide={this.handlePlaceBidClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Place Bid</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Placebid />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handlePlaceBidClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {this.state.carData.map((car) => (
                    <table key={car.id}>
                        <tr>
                            <th style={{ width: 180 + 'px', borderRight: "2px solid white"}}>Make</th>
                            <td style={{ width: 500 + 'px' }}>{car.make}</td>
                        </tr>
                        <tr>
                            <th style={{ borderRight: "2px solid white" }}>Model</th>
                            <td>{car.modelName}</td>
                        </tr>
                        <tr>
                            <th style={{ borderRight: "2px solid white" }}>Interior Color</th>
                            <td>{car.interiorColor}</td>
                        </tr>
                        <tr>
                            <th style={{ borderRight: "2px solid white" }}>Exterior Color</th>
                            <td>{car.exteriorColor}</td>
                        </tr>
                    </table>
                ))}

                <div>
                    <label class="cardetails_label" style={{ marginTop: 30 + 'px' }}>Highlights</label>
                    <hr class="solid" />
                </div>

                <div>
                    <label class="cardetails_label">Equipment</label>
                    <hr class="solid" />
                </div>

                <div>
                    <label class="cardetails_label">Modifications</label>
                    <hr class="solid" />
                </div>

                <div>
                    <label class="cardetails_label">Known Flaws</label>
                    <hr class="solid" />
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
}