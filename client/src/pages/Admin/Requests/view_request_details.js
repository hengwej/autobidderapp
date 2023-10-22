import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Table, Card, Button } from 'react-bootstrap';

export default function ViewRequestDetails() {
    const { requestID } = useParams();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carImageSrc, setCarImageSrc] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/api/requests/viewRequestDetails/${requestID}`)
            .then((response) => {
                setRequest(response.data);
                if (response.data.carImage && response.data.carImage.data) {
                    // Convert the blob to a data URL
                    const blob = new Blob([new Uint8Array(response.data.carImage.data)]);
                    const url = URL.createObjectURL(blob);
                    setCarImageSrc(url);
                }
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [requestID]);

    const handleApprove = () => {
        // Implement the logic to approve the request here
    };

    const handleReject = () => {
        // Implement the logic to reject the request here
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    if (!request) return <div>Request not found</div>;

    return (
        <Card>
            <Card.Header>View Request Details</Card.Header>
            <Card.Body>
                <div>
                    <Table>
                        <tbody>
                            <tr>
                                <td>Request ID:</td>
                                <td>{request.requestID}</td>
                            </tr>
                            <tr>
                                <td>Status:</td>
                                <td>{request.requestStatus}</td>
                            </tr>
                            <tr>
                                <td>Vehicle Number:</td>
                                <td>{request.vehicleNumber}</td>
                            </tr>
                            <tr>
                                <td>Image:</td>
                                <td>
                                    {carImageSrc && <img src={carImageSrc} alt="Car" style={{ width: "150px", height: "100px" }} />}
                                </td>
                            </tr>
                            <tr>
                                <td>Model:</td>
                                <td>{request.model}</td>
                            </tr>
                            <tr>
                                <td>Make:</td>
                                <td>{request.make}</td>
                            </tr>
                            <tr>
                                <td>Highlights:</td>
                                <td>{request.highlights}</td>
                            </tr>
                            <tr>
                                <td>Known Flaws:</td>
                                <td>{request.knownFlaws}</td>
                            </tr>
                            <tr>
                                <td>Starting Bid:</td>
                                <td>${request.startingBid}</td>
                            </tr>
                            <tr>
                                <td>Reserve Price:</td>
                                <td>${request.reservePrice}</td>
                            </tr>
                            <tr>
                                <td>Account ID:</td>
                                <td>{request.accountID}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <div style={{ marginTop: "10px" }}>
                        <Button variant="success" onClick={handleApprove}>Approve</Button>
                        <span style={{ margin: "10px" }}></span>
                        <Button variant="danger" onClick={handleReject}>Reject</Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}