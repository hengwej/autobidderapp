import React, { Component } from "react";
import { useNavigate } from "react-router-dom"; // Import the hook
import "../../../css/styles.css";
import "../styles.css";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Button from "react-bootstrap/Button";
import "../../../css/styles.css";
import "../styles.css";
import { Table, Card } from "react-bootstrap";


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
        try {
            const response = await fetch("http://127.0.0.1:5000/api/users/getAllUsers");
            const data = await response.json();
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
                axios.delete(`http://127.0.0.1:5000/api/users/deleteUser/${userID}`)
                    .then((response) => {
                        this.setState({ showSuccess: true });
                        console.log("User deleted successfully");
                    })
                    .catch((error) => {
                        console.error("Error deleting user:", error);
                    });
            }
        } else {
            console.error("Invalid user ID:", userID);
        }
    }

    // Automatically refresh the page after deletion
    componentDidUpdate(prevProps, prevState) {
        if (prevState.showSuccess !== this.state.showSuccess && this.state.showSuccess) {
            setTimeout(() => {
                window.location.reload();
            }, 2000); // Refresh the page after 2 seconds
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
            <Container fluid>
                {this.state.showSuccess && (
                    <div className="success-message">User deleted successfully!</div>
                )}
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
    return <UserManagement navigate={navigate} />;
}// Wrap and export
