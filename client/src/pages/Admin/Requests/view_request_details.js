import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Card, Button, Alert,Container } from 'react-bootstrap';

export default function ViewRequestDetails() {
    const { requestID } = useParams();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carImageSrc, setCarImageSrc] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

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
    axios.post(`http://127.0.0.1:5000/api/requests/approveRequest/${requestID}`)
        .then((response) => {
            setSuccessMessage("Request approved successfully");
            console.log('Request approved successfully:', response.data);
        })
        .catch((error) => {
            // Display the error message or handle the error as needed
            console.error('Error while approving request:', error);
            if (error.response) {
                // The request was made, but the server responded with an error.
                // You can access the response status and data.
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            } else if (error.request) {
                // The request was made, but no response was received (e.g., network error).
                console.error('Request:', error.request);
            } else {
                // Something happened in setting up the request that triggered the error.
                console.error('Error:', error.message);
            }
        });
};


    const handleReject = () => {
        // Display a confirmation dialog
        const shouldDelete = window.confirm("Are you sure you want to reject this request?");

        if (shouldDelete) {
            // Send an API request to delete the request when the "Reject" button is clicked.
            axios.delete(`http://127.0.0.1:5000/api/requests/rejectRequest/${requestID}`)
                .then((response) => {
                    // Handle success, show a message, and refresh the page.
                    setSuccessMessage("Request rejected successfully");
                    console.log('Request rejected successfully:', response.data);
                })
                .catch((error) => {
                    setError(error);
                });
        }
    };


    useEffect(() => {
        // Automatically refresh the page after deletion
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
                navigate("/Requests");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    if (!request) return <div>Request not found</div>;

    return (
        <Container>
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
                        {successMessage && (
                            <Alert variant="success" style={{ marginTop: "10px" }}>
                                {successMessage}
                            </Alert>
                        )}
                        {request.requestStatus !== "Rejected" && (
                            <div style={{ marginTop: "10px" }}>
                                <Button variant="success" onClick={handleApprove}>Approve</Button>
                                <span style={{ margin: "10px" }}></span>
                                <Button variant="danger" onClick={handleReject}>Reject</Button>
                            </div>
                        )}
                        {request.requestStatus === "Rejected" && (
                            <Alert variant="danger" style={{ marginTop: "10px" }}>
                                This request has been rejected by admin.
                            </Alert>
                        )}
                    </div>
            </Card.Body>
            </Card>
        </Container>
    );
}