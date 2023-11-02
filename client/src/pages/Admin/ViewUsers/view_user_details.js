import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Container } from "react-bootstrap";
import * as usersAPI from "../../../utils/UserProfileAPI.js";

export default function ViewUserDetails() {
    const { userID } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch user details based on the userId from the URL
        usersAPI.viewUser(userID)
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
                <Card.Header style={{ fontWeight: "bold" }}>View User Details</Card.Header>
                <Card.Body>
                    <div>
                        <p><b>First Name:</b> {user.firstName}</p>
                        <p><b>Last Name:</b> {user.lastName}</p>
                        <p><b>Email:</b> {user.emailAddress}</p>
                        <p><b>Phone Number:</b> {user.phoneNumber}</p>
                        <p><b>Address:</b> {user.address}</p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
