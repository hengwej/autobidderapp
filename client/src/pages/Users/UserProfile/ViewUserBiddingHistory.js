import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Table, Button, Container, Dropdown, Row, Col} from 'react-bootstrap';
import './styles.css';

const ViewUserBiddingHistory = () => {
  const [biddingHistory, setBiddingHistory] = useState([]);
  const [displayedHistory, setDisplayedHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Table Page
  const [expandedItem, setExpandedItem] = useState(null);
  const recordsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  
  // Sorting and Filtering
  const [sortBy, setSortBy] = useState("bidID"); // Default sort by bidID
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order ascending
  const [sortingFilter, setSortingFilter] = useState(""); // Default no sorting filter
  const [bidStatusFilter, setBidStatusFilter] = useState(""); // Default no status filter


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
    // Create a copy of the biddingHistory to avoid modifying the original data
    let sortedBiddingHistory = [...biddingHistory];
  
    // Filter by bid status
    if (bidStatusFilter === "Active Bids") {
      sortedBiddingHistory = sortedBiddingHistory.filter(bid => bid.bidStatus.toLowerCase() === "active");
    } else if (bidStatusFilter === "Outbidded Bids") {
      sortedBiddingHistory = sortedBiddingHistory.filter(bid => bid.bidStatus.toLowerCase() === "outbidded");
    } else if (bidStatusFilter === "Closed Bids") {
      sortedBiddingHistory = sortedBiddingHistory.filter(bid => bid.bidStatus.toLowerCase() === "closed");
    }
  
    // Sort the filtered data
    sortedBiddingHistory.sort((a, b) => {
      if (sortBy === "bidTimestamp") {
        const timestampA = new Date(a.bidTimestamp).toLocaleString({ timeZone: 'Asia/Singapore' });
        const timestampB = new Date(b.bidTimestamp).toLocaleString({ timeZone: 'Asia/Singapore' });
        return sortOrder === "asc" ? new Date(timestampA) - new Date(timestampB) : new Date(timestampB) - new Date(timestampA);
      } else if (sortBy === "bidAmount") {
        return sortOrder === "asc" ? a.bidAmount - b.bidAmount : b.bidAmount - a.bidAmount;
      } else if (sortBy === "bidID") {
        return sortOrder === "asc" ? a.bidID - b.bidID : b.bidID - a.bidID;
      }
      return 0;
    });
  
    // Calculate the number of pages
    const totalRecords = sortedBiddingHistory.length;
    const numPages = Math.ceil(totalRecords / recordsPerPage);
    setNumPages(numPages);

    // Calculate the range of records to display for the current page
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, totalRecords);
    
    // Set the displayed records based on the range
    setDisplayedHistory(sortedBiddingHistory.slice(startIndex, endIndex));
  }, [biddingHistory, currentPage, sortBy, sortOrder, bidStatusFilter]);

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
          <Row>
            <Col>
              <Dropdown className="d-flex justify-content-start Filter-dropdown">
                <Dropdown.Toggle variant="primary" size="sm" id="bidStatusFilterDropdown">
                  Filter By: {bidStatusFilter || "None"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => {setBidStatusFilter("Active Bids"); setCurrentPage(1);}}>Active Bids</Dropdown.Item>
                  <Dropdown.Item onClick={() => {setBidStatusFilter("Outbidded Bids"); setCurrentPage(1);}}>Outbidded Bids</Dropdown.Item>
                  <Dropdown.Item onClick={() => {setBidStatusFilter("Closed Bids"); setCurrentPage(1);}}>Closed Bids</Dropdown.Item>
                  <Dropdown.Item onClick={() => {setBidStatusFilter(""); setCurrentPage(1);}}>Clear Status Filter</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col>
              <Dropdown className="d-flex justify-content-end Filter-dropdown">
                <Dropdown.Toggle variant="primary" size="sm" id="bidSortingFilterDropdown">
                  Sort By: {sortingFilter || "None"}
                </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => {setSortingFilter("Oldest Bid First"); setSortBy("bidTimestamp"); setSortOrder("asc"); setCurrentPage(1);}}>Oldest Bid First</Dropdown.Item>
                <Dropdown.Item onClick={() => {setSortingFilter("Newest Bid First"); setSortBy("bidTimestamp"); setSortOrder("desc"); setCurrentPage(1);}}>Newest Bid First</Dropdown.Item>
                <Dropdown.Item onClick={() => {setSortingFilter("Lowest Bid First"); setSortBy("bidAmount"); setSortOrder("asc"); setCurrentPage(1);}}>Lowest Bid First</Dropdown.Item>
                <Dropdown.Item onClick={() => {setSortingFilter("Highest Bid First"); setSortBy("bidAmount"); setSortOrder("desc"); setCurrentPage(1);}}>Highest Bid First</Dropdown.Item>
                <Dropdown.Item onClick={() => {setSortingFilter("None"); setSortBy("bidID"); setSortOrder("asc"); setCurrentPage(1);}}>Clear Sorting Filter</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row> 
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
            <Button variant="primary" size="sm" className="Page-button" disabled={currentPage >= numPages} onClick={handleNextPage}>Next</Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ViewUserBiddingHistory;