import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Table } from 'react-bootstrap';

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    if (!request) return <div>Request not found</div>;

    return (
        <div>
            <p id="view-request-details">View Request Details</p>
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
                    <td>
                        <td>{request.model}</td>
                        </td>
                    </tr>

                    <tr>

                        <td>Make:</td>
                        <td>
                            <td>{request.make}</td>
                        </td>
                    </tr>

                    <tr>

                        <td>Highlights:</td>
                        <td>
                            <td>{request.highlights}</td>
                        </td>
                    </tr>
                    <tr>

                        <td>Known flaws:</td>
                        <td>
                            <td>{request.knownFlaws}</td>
                        </td>
                    </tr>



                    <tr>

                        <td>Starting bid:</td>
                        <td>
                            <td>${request.startingBid}</td>
                        </td>
                    </tr>
                    <tr>

                        <td>Reserve Price:</td>
                        <td>
                            <td>${request.reservePrice}</td>
                        </td>
                    </tr>

                    <tr>

                        <td>Account ID:</td>
                        <td>
                            <td>{request.accountID}</td>
                        </td>
                    </tr>
                    {/* Add more request details here */}
                </tbody>
            </Table>
        </div>
    );
}
