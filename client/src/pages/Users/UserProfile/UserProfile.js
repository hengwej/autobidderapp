import React, { useState } from "react";
import { Nav, Tab, Container, Row, Col } from 'react-bootstrap';
import ViewUserProfileDetails from './ViewUserProfileDetails';
import ViewUserSellingHistory from './ViewUserSellingHistory';
import ViewUserBiddingHistory from './ViewUserBiddingHistory';
import ViewSellCarRequests from './ViewSellCarRequests';
import './styles.css';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profileDetails");
  const handleTabChange = (eventKey) => {
    setActiveTab(eventKey);
  };

  return (
    <Container className="custom-container">
      <Tab.Container id="left-tabs-example" activeKey={activeTab} onSelect={handleTabChange}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column custom-nav">
              <Nav.Item>
                <Nav.Link eventKey="profileDetails">Profile Details</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="biddingHistory">Bidding History</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="sellingHistory">Selling History</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="carRequests">Sell Car Requests</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="profileDetails">
                {activeTab === "profileDetails" && <ViewUserProfileDetails />}
              </Tab.Pane>
              <Tab.Pane eventKey="biddingHistory">
                {activeTab === "biddingHistory" && <ViewUserBiddingHistory />}
              </Tab.Pane>
              <Tab.Pane eventKey="sellingHistory">
                {activeTab === "sellingHistory" && <ViewUserSellingHistory />}
              </Tab.Pane>
              <Tab.Pane eventKey="carRequests">
                {activeTab === "carRequests" && <ViewSellCarRequests />}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default UserProfile;