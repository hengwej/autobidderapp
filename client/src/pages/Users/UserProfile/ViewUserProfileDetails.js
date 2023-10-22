import React, { useEffect, useState } from "react";
import axios from 'axios';
import {Container, Col, Row, Card, CardTitle } from 'react-bootstrap';
import './styles.css'; 
import UserAccountDeletion from './UserAccountDeletion';
import EditUserProfile from './EditUserProfile';

const ViewUserProfileDetails = () => {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const accountID = 22;

    // Fetch user details based on the account identifier
    axios.get(`http://localhost:5000/api/users/getUserProfileDetails/${accountID}`)
      .then(userResponse => {
        setUser(userResponse.data);
      })
      .catch(userError => {
        console.error("Failed to fetch user data:", userError);
      });

    // Fetch account details based on the account identifier
    axios.get(`http://localhost:5000/api/accounts/getUserAccountDetails/${accountID}`)
      .then(accountResponse => {
        setAccount(accountResponse.data);
      })
      .catch(accountError => {
        console.error("Failed to fetch account data:", accountError);
      });

  }, []);

  return (
    <Container>
      {user && account ? (
        <Card> 
          <Row>
            <Col>
              <Card.Body>
                <div>
                  <CardTitle className="text-center">Profile Details</CardTitle>
                  <p>Username: {account.username}</p>
                  <p>First Name: {user.firstName}</p>
                  <p>Last Name: {user.lastName}</p>
                  <p>Email: {user.emailAddress}</p>
                  <p>Address: {user.address}</p>
                  <p>Phone Number: {user.phoneNumber}</p>
                </div>
              </Card.Body>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col sm={5}>
              {/* <Button variant="primary" onClick={handleEditUserDetails} className="UserProfile-button">Edit Profile</Button> */}
              <EditUserProfile account={account} user={user}/>
              <UserAccountDeletion account={account}/>
            </Col>
          </Row>  
        </Card>
      ) : (
        <p>Loading user data...</p>
      )}
    </Container>
  );
};

export default ViewUserProfileDetails;