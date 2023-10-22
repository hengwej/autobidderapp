import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Card } from 'react-bootstrap';
import Container from "react-bootstrap/Container";
import axios from 'axios';
import Button from "react-bootstrap/Button";

class Requests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: [],
            loading: true,
            error: null,
        };
    }

    async componentDidMount() {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/requests/getAllRequests');
            this.setState({ requests: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching data:", error);
            this.setState({ error, loading: false });
        }
    }

    // Handle navigation to view request details page
    handleViewDetails = (requestID) => {
        this.props.navigate(`/viewRequestDetails/${requestID}`);
    }

    render() {
        if (this.state.loading) return <div>Loading...</div>;
        if (this.state.error) return <div>Error: {this.state.error.message}</div>;

        return (
            <Container fluid>
                <Card>
                    <Card.Header>Requests</Card.Header>
                    <Card.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>Request Status</th>
                                    <th>Request Submission Time</th>
                                    <th>Vehicle Number</th>
                                    <th>View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.requests.map((request) => (
                                    <tr key={request.requestID}>
                                        <td>{request.requestID}</td>
                                        <td>{request.requestStatus}</td>
                                        <td>{new Date(request.requestSubmissionTime).toLocaleString('en-US', { hour12: false })}</td>
                                        <td>{request.vehicleNumber}</td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                onClick={() => this.handleViewDetails(request.requestID)}
                                            >
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

export default function RequestsWithNavigation() {
    const navigate = useNavigate();
    return <Requests navigate={navigate} />;
}