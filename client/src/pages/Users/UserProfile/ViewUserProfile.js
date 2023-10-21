import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Nav, Tab, Container, Row, Col, Table } from 'react-bootstrap';
import './styles.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [biddingHistory, setBiddingHistory] = useState([]);
  const [sellingHistory, setSellingHistory] = useState([]);

  useEffect(() => {
    const accountID = 9;

    // Fetch user details based on the account identifier
    axios.get(`http://localhost:5000/api/users/getUserDetails/${accountID}`)
      .then(userResponse => {
        setUser(userResponse.data);
      })
      .catch(userError => {
        console.error("Failed to fetch user data:", userError);
      });

    // Fetch bidding history based on the account identifier
    axios.get(`http://localhost:5000/api/users/getUserBiddingHistory/${accountID}`)
      .then(biddingHistoryResponse => {
        setBiddingHistory(biddingHistoryResponse.data);
      })
      .catch(biddingHistoryError => {
        console.error("Failed to fetch bidding history:", biddingHistoryError);
      });

    // Fetch selling history based on the account identifier
    axios.get(`http://localhost:5000/api/users/getUserSellingHistory/${accountID}`)
      .then(sellingHistoryResponse => {
        setSellingHistory(sellingHistoryResponse.data);
      })
      .catch(sellingHistoryError => {
        console.error("Failed to fetch selling history:", sellingHistoryError);
      });
  }, []);

  return (
    <Container fluid>
      <Tab.Container id="user-details-tabs" defaultActiveKey="profileDetails">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="profileDetails">Profile Details</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="biddingHistory">Bidding History</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="sellingHistory">Selling History</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="profileDetails">
                {user ? (
                  <div>
                    <p>Name: {user.firstName} {user.lastName}</p>
                    <p>Email: {user.emailAddress}</p>
                    <p>Phone Number: {user.phoneNumber}</p>
                  </div>
                ) : (
                  <p>Loading user data...</p>
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="biddingHistory">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Bid ID</th>
                      <th>Amount</th>
                      <th>Timestamp</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {biddingHistory.map((bid) => (
                      <tr key={bid.bidID}>
                        <td>{bid.bidID}</td>
                        <td>{bid.bidAmount}</td>
                        <td>{bid.bidTimestamp}</td>
                        <td>{bid.bidStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab.Pane>
              <Tab.Pane eventKey="sellingHistory">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Sale ID</th>
                      <th>Order ID</th>
                      <th>Order Status</th>
                      <th>Payment Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellingHistory.map((sale) => (
                      <tr key={sale.saleID}>
                        <td>{sale.saleID}</td>
                        <td>{sale.orderID}</td>
                        <td>{sale.order.orderStatus}</td>
                        <td>{sale.order.paymentDeadline}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default UserProfile;
