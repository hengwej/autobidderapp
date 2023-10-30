import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card,Container } from "react-bootstrap";



export default function ViewUserDetails() {
    const { userID } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch user details based on the userId from the URL
        axios.get(`http://127.0.0.1:5000/api/users/viewUser/${userID}`)
            .then((response) => {
                setUser(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [userID]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    if (!user) return <div>User not found</div>;

    return (
        <Container>
        <Card>
            <Card.Header>View User Details</Card.Header>
            <Card.Body>
                <div>
                    <p>Name: {user.firstName} {user.lastName}</p>
                    <p>Email: {user.emailAddress}</p>
                    <p>Phone Number: {user.phoneNumber}</p>
                    <p>Address: {user.address}</p>
                </div>
            </Card.Body>
            </Card>
        </Container>
    );
}
