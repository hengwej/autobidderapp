import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Table, Button, Container } from 'react-bootstrap';
import './styles.css';

const ViewUserSellingHistory = () => {
  const [sellingHistory, setSellingHistory] = useState([]);
  const [displayedHistory, setDisplayedHistory] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const recordsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.post('http://localhost:5000/api/users/getUserSellingHistory', {}, { withCredentials: true })
      .then(response => {
        setSellingHistory(response.data);
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
    setDisplayedHistory(sellingHistory.slice(startIndex, endIndex));
  }, [sellingHistory, currentPage]);

  const handleViewDetails = (saleID) => {
    if (expandedItem === saleID) {
      // If the same row is clicked again, close it
      setExpandedItem(null);
    } else {
      setExpandedItem(saleID);
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
      <h3>Selling History</h3>
      {loading ? (
        <p>Loading selling history...</p>
      ) : sellingHistory.length === 0 ? (
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
              {displayedHistory.map((sale) => (
                <React.Fragment key={sale.saleID}>
                  <tr>
                    <td>{sale.orderID}</td>
                    <td>
                      <div className="UserProfileDetails">
                        <p><span>Order Status:</span> {sale.order.orderStatus}</p>
                        {sale.order.orderStatus.toLowerCase() !== 'pending' ? (
                          <p><span>Completion Time:</span> {new Date(sale.order.orderCompletionTime).toLocaleString({ timeZone: 'Asia/Singapore' })}</p>
                        ) : (
                        <p><span>Completion Time:</span> Not Available</p>
                        )}
                        <p><span>Bidder:</span> {sale.order.account.username}</p>
                      </div>
                      {expandedItem === sale.saleID && (
                        <div className="UserProfileDetails">
                          <p><span>Amount:</span> ${sale.order.auction.currentHighestBid}</p>
                          <p><span>Car Details:</span> {`${sale.order.auction.car.exteriorColor} ${sale.order.auction.car.make} ${sale.order.auction.car.model}`}</p>
                        </div>
                      )}
                    </td>
                    <td>
                      <Button variant="primary" size="sm" className="HistoryTable-button" onClick={() => handleViewDetails(sale.saleID)}>
                        {expandedItem === sale.saleID ? 'View Less' : 'View More'}
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
            <Button variant="primary" size="sm" className="Page-button" disabled={currentPage * recordsPerPage >= sellingHistory.length} onClick={handleNextPage}>Next</Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ViewUserSellingHistory;