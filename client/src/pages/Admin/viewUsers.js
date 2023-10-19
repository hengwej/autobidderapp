import React, { Component } from "react";
import "../../css/styles.css";
import "./styles.css";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../../components/Header";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import { Table } from 'react-bootstrap';

export default class UserManagement extends Component {
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

    render() {
        if (this.state.loading) return <div>Loading...</div>;
        if (this.state.error) return <div>Error: {this.state.error.message}</div>;

        return (
            <Container fluid>
                {this.state.showSuccess && <div className="success-message">User deleted successfully!</div>}
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
                                    <Button variant="danger" onClick={() => this.handleDeleteUser(user.userID)}>Delete</Button>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={() => this.handleEditUser(user.id)}>View</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        );
    }
}
