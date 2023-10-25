import React, { useEffect, useState } from "react";
import { Container, Col, Row, Card } from 'react-bootstrap';
import './styles.css';
import UserAccountDeletion from './UserAccountDeletion';
import EditUserProfile from './EditUserProfile';
import ResetPassword from './ResetPassword';
import * as api from '../../../utils/UserProfileAPI';

const ViewUserProfileDetails = () => {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserProfileDetails() {
      try {
        const response = await api.userProfileDetails();
        if (response.status === 200) {
          setUser(response.data.user);
          setAccount(response.data.account);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfileDetails();

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
              <ResetPassword />
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