import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Table, Button, Container } from 'react-bootstrap';
import './styles.css';

const ViewUserBiddingHistory = () => {
  const [biddingHistory, setBiddingHistory] = useState([]);
  const [displayedHistory, setDisplayedHistory] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const recordsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.post('http://localhost:5000/api/users/getUserBiddingHistory', {}, { withCredentials: true })
      .then(response => {
        setBiddingHistory(response.data);
      })
      .catch(error => {
        console.error("Failed to fetch user profile:", error);
      })
      .finally(() => {
        setLoading(false);
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
    <Container fluid>
      <h3>Bidding History</h3>
      {loading ? (
        <p>Loading bidding history...</p>
      ) : biddingHistory.length === 0 ? (
        <p>Error: No records found</p>
      ) : (
        <div>
          <Table className="TableHeader-grey">
            <thead>
              <tr>
                <th>ID</th>
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
                      <div className="UserProfileDetails">
                        <p><span>Bid Status:</span> {bid.bidStatus}</p>
                        <p><span>Bid Time:</span> {new Date(bid.bidTimestamp).toLocaleString({ timeZone: 'Asia/Singapore' })}</p>
                        <p><span>Bid Amount:</span> ${bid.bidAmount}</p>
                      </div>
                      {expandedItem === bid.bidID && (
                        <div className="UserProfileDetails">
                          <p><span>Auction ID:</span> {bid.auction.auctionID}</p>
                          <p><span>Auction Status:</span> {bid.auction.auctionStatus}</p>
                          <p><span>Car Details:</span> {`${bid.auction.car.exteriorColor} ${bid.auction.car.make} ${bid.auction.car.model}`}</p>
                        </div>
                      )}
                    </td>
                    <td>
                      <Button variant="primary" size="sm" className="HistoryTable-button" onClick={() => handleViewDetails(bid.bidID)}>
                        {expandedItem === bid.bidID ? 'View Less' : 'View More'}
                      </Button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center UserProfileDetails">
            <Button variant="primary" size="sm" className="Page-button" disabled={currentPage === 1} onClick={handlePreviousPage}>Previous</Button>
            <span className="page-number mx-4">{currentPage}</span>
            <Button variant="primary" size="sm" className="Page-button" disabled={currentPage * recordsPerPage >= biddingHistory.length} onClick={handleNextPage}>Next</Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ViewUserBiddingHistory;