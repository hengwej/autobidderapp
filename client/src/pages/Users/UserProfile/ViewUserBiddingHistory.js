import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import './styles.css';

const ViewUserBiddingHistory = () => {
  const [biddingHistory, setBiddingHistory] = useState([]);
  const [displayedHistory, setDisplayedHistory] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const recordsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.post('http://localhost:5000/api/users/getUserBiddingHistory', {}, { withCredentials: true })
      .then(response => {
        setBiddingHistory(response.data);
      })
      .catch(error => {
        console.error("Failed to fetch user profile:", error);
      });
  }, []);

  useEffect(() => {
    // Calculate the range of records to display for the current page
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;

    // Set the displayed records based on the range
    setDisplayedHistory(biddingHistory.slice(startIndex, endIndex));
  }, [biddingHistory, currentPage]);

  const handleViewDetails = (bidID) => {
    if (expandedItem === bidID) {
      // If the same row is clicked again, close it
      setExpandedItem(null);
    } else {
      setExpandedItem(bidID);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h3>Bidding History</h3>
      {biddingHistory.length === 0 ? (
        <p>No records found</p>
      ) : (
        <div>
          <Table className="table-header-grey">
            <thead>
              <tr>
                <th>Bid ID</th>
                <th>Details</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedHistory.map((bid) => (
                <React.Fragment key={bid.bidID}>
                  <tr>
                    <td>{bid.bidID}</td>
                    <td>
                      <div>
                        <p>Bid Time: {new Date(bid.bidTimestamp).toLocaleString({ timeZone: 'Asia/Singapore' })}</p>
                        <p>Bid Status: {bid.bidStatus}</p>
                        <p>Bid Amount: {bid.bidAmount}</p>
                      </div>
                      {expandedItem === bid.bidID && (
                        <div>
                          <p>Auction ID: {bid.auction.auctionID}</p>
                          <p>Auction Status: {bid.auction.auctionStatus}</p>
                          <p>Car Details: {`${bid.auction.car.exteriorColor} ${bid.auction.car.make} ${bid.auction.car.model}`}</p>
                        </div>
                      )}
                    </td>
                    <td>
                      <Button variant="primary" size="sm" onClick={() => handleViewDetails(bid.bidID)}>
                        {expandedItem === bid.bidID ? 'View Less Details' : 'View All Details'}
                      </Button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
          <div className="pagination d-flex justify-content-end">
            <Button variant="primary" size="sm" disabled={currentPage === 1} onClick={handlePreviousPage}>Previous</Button>
            <span className="page-number">{currentPage}</span>
            <Button variant="primary" size="sm" disabled={currentPage * recordsPerPage >= biddingHistory.length} onClick={handleNextPage}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUserBiddingHistory;