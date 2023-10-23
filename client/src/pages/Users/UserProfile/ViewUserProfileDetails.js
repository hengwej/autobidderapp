import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Container, Col, Row, Card} from 'react-bootstrap';
import './styles.css';
import UserAccountDeletion from './UserAccountDeletion';
import EditUserProfile from './EditUserProfile';

const ViewUserProfileDetails = () => {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.post('http://localhost:5000/api/users/getUserProfileDetails', {}, { withCredentials: true })
      .then(response => {
        setUser(response.data.user);
        setAccount(response.data.account);
      })
      .catch(error => {
        console.error("Failed to fetch user profile:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Container fluid>
      <h3>Profile Details</h3>
      {loading ? (
        <p>Loading user data...</p>
      ) : user && account ? (
        <Card>
          <Row>
            <Col>
              <Card.Body>
                <div className="UserProfileDetails">
                  <p><span>Username:</span> {account.username}</p>
                  <p><span>First Name:</span> {user.firstName}</p>
                  <p><span>Last Name:</span> {user.lastName}</p>
                  <p><span>Email:</span> {user.emailAddress}</p>
                  <p><span>Address:</span> {user.address}</p>
                  <p><span>Phone Number:</span> {user.phoneNumber}</p>
                </div>
              </Card.Body>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col sm={5}>
              <EditUserProfile account={account} user={user} />
              <UserAccountDeletion />
            </Col>
          </Row>
        </Card>
      ) : (
        <p>Error: No records found.</p>
      )}
    </Container>
  );
};

export default ViewUserProfileDetails;