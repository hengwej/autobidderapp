import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Card, Container, Row, Col } from 'react-bootstrap';
import Button from "react-bootstrap/Button";
import { Dropdown } from 'react-bootstrap';
import * as requestsAPI from "../../../utils/RequestsAPI.js";
import { useAuth } from '../../../utils/AuthProvider';






class Requests extends Component {

    constructor(props) {
        super(props);
        this.state = {
            requests: [],
            loading: true,
            error: null,
            requestStatusFilter: "",
        };
    }

    async componentDidMount() {
        if (this.props.csrfToken) {
            this.fetchData(this.props.csrfToken);
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.props.csrfToken && this.props.csrfToken !== prevProps.csrfToken) {
            this.fetchData(this.props.csrfToken);
        }
    }

    async fetchData(csrfToken) {
        try {
            const response = await requestsAPI.getAllRequests(csrfToken);
            this.setState({ requests: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching data:", error);
            this.setState({ error, loading: false });
        }
    }

    handleViewDetails = (requestID) => {
        this.props.navigate(`/viewRequestDetails/${requestID}`);
    }

    filterRequests = (filter) => {
        this.setState({ requestStatusFilter: filter });
    }

    render() {
        if (this.state.loading) return <div>Loading...</div>;
        if (this.state.error) return <div>Error: {this.state.error.message}</div>;

        return (
            <Container className="request-page">
                <Row>
                    <Col>
                        <div className="dropdown-container">
                            <Dropdown style={{ backgroundColor: "#ff692d", border: "none" }}>
                                <Dropdown.Toggle
                                    variant="primary"
                                    id="requestStatusFilterDropdown"
                                    style={{ backgroundColor: "#ff692d", border: "none", paddingLeft: "10px" }}
                                >
                                    Filter By: {this.state.requestStatusFilter || "All Requests"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => this.filterRequests("")}>All Requests</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.filterRequests("Rejected")}>Rejected Requests</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.filterRequests("Pending")}>Pending Requests</Dropdown.Item>

                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <Card className="table-container">
                            <Card.Header></Card.Header>
                            <Card.Body>
                                <Table style={{ marginTop: "20px" }} bordered striped responsive>
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
                                        {this.state.requests
                                            .filter((request) =>
                                                this.state.requestStatusFilter === "" ||
                                                request.requestStatus.toLowerCase() === this.state.requestStatusFilter.toLowerCase()
                                            )
                                            .map((request) => (
                                                <tr key={request.requestID}>
                                                    <td>{request.requestID}</td>
                                                    <td>{request.requestStatus}</td>
                                                    <td>{Date(request.requestSubmissionTime).toLocaleString('en-US', { timeZone: 'Asia/Singapore' })}</td>
                                                    <td>{request.vehicleNumber}</td>
                                                    <td>


                                                        <Button
                                                            style={{ backgroundColor: "#ff692d", border: "none" }}
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
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default function RequestsWithNavigation() {
    const navigate = useNavigate();
    const { csrfToken } = useAuth();

    return <Requests navigate={navigate} csrfToken={csrfToken} />;
}
