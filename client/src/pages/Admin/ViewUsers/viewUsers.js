import React, { Component } from "react";
import { useNavigate } from "react-router-dom"; // Import the hook
import "../../../css/styles.css";
import "../styles.css";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import "../../../css/styles.css";
import "../styles.css";
import { Table, Card } from "react-bootstrap";
import * as usersAPI from "../../../utils/UserProfileAPI.js";
import { useAuth } from "../../../utils/AuthProvider";

class UserManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: [],
            loading: true,
            error: null,
            showSuccess: false,
        };
        this.handleDeleteUser = this.handleDeleteUser.bind(this);
    }

    async componentDidMount() {
        if (this.props.csrfToken) {
            this.fetchData(this.props.csrfToken);
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.props.csrfToken && this.props.csrfToken !== prevProps.csrfToken) {
            this.fetchData(this.props.csrfToken);
        }

        if (prevState.showSuccess !== this.state.showSuccess && this.state.showSuccess) {
            setTimeout(() => {
                window.location.reload();
            }, 2000); // Refresh the page after 2 seconds
        }
    }

    async fetchData(csrfToken) {
        try {
            const response = await usersAPI.getAllUsers(csrfToken);
            const data = await response.data;
            this.setState({ userData: data, loading: false });
        } catch (error) {
            console.error("Error fetching data:", error);
            this.setState({ error, loading: false });
        }
    }

    // Add a confirmation popup and success message handling
    handleDeleteUser = (userID) => {
        if (Number.isInteger(userID)) {
            const confirmed = window.confirm("Are you sure you want to delete this user?");
            if (confirmed) {
                usersAPI
                    .deleteUser(userID, this.props.csrfToken)
                    .then((response) => {
                        if (response.status === 200) {
                            window.alert("User deleted successfully");
                            this.setState({ showSuccess: true });
                        } else {
                            window.alert("Failed to delete user");
                        }
                    })
                    .catch((error) => {
                        console.error("Error deleting user");
                        window.alert("Failed to delete user");
                    });
            }
        } else {
            console.error("Invalid user");
        }
    }

    // Handle navigation to edit user details page
    handleViewUser = (userID) => {
        this.props.navigate(`/viewUser/${userID}`); // Use the passed navigate function
    }

    render() {
        if (this.state.loading) return <div>Loading...</div>;
        if (this.state.error) return <div>Error: {this.state.error.message}</div>;

        return (
            <Container>
                <Card>
                    <Card.Header>User Management</Card.Header>
                    <Card.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.userData.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.firstName}</td>
                                        <td>{user.emailAddress}</td>
                                        <td>{user.phoneNumber}</td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                onClick={() => this.handleDeleteUser(user.userID)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                style={{ backgroundColor: "#ff692d ", border: "none" }}
                                                onClick={() => this.handleViewUser(user.userID)}
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

export default function UserManagementWithNavigation() {
    const navigate = useNavigate(); // Initialize navigate using useNavigate hook
    const { csrfToken } = useAuth();
    return <UserManagement navigate={navigate} csrfToken={csrfToken} />;
}// Wrap and export
