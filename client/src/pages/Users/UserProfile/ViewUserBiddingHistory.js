import React, { useEffect, useState } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';

const ViewUserBiddingHistory = () => {
  const [biddingHistory, setBiddingHistory] = useState([]);

  useEffect(() => {
    const accountID = 9;
    
    // Fetch bidding history based on the account identifier
    axios.get(`http://localhost:5000/api/users/getUserBiddingHistory/${accountID}`)
      .then(biddingHistoryResponse => {
        setBiddingHistory(biddingHistoryResponse.data);
      })
      .catch(biddingHistoryError => {
        console.error("Failed to fetch bidding history:", biddingHistoryError);
      });

  }, []);

  return (
    <div>
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
    </div>
  );
};

export default ViewUserBiddingHistory;
