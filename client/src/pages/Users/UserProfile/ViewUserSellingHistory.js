import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import './styles.css';

const ViewUserSellingHistory = () => {
  const [sellingHistory, setSellingHistory] = useState([]);
  const [displayedHistory, setDisplayedHistory] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const recordsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.post('http://localhost:5000/api/users/getUserSellingHistory', {}, { withCredentials: true })
      .then(response => {
        setSellingHistory(response.data);
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
    setDisplayedHistory(sellingHistory.slice(startIndex, endIndex));
  }, [sellingHistory, currentPage]);

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
      <h3>Selling History</h3>
      {sellingHistory.length === 0 ? (
        <p>No records found</p>
      ) : (
        <div>
          <Table className="table-header-grey">
            <thead>
              <tr>
                <th>Order ID</th>
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
                      <div>
                        <p>Order Completion Time: {new Date(sale.order.orderCompletionTime).toLocaleString({ timeZone: 'Asia/Singapore' })}</p>
                        <p>Order Status: {sale.order.orderStatus}</p>
                        <p>Bidder: {sale.account.username}</p>
                      </div>
                      {expandedItem === sale.saleID && (
                        <div>
                          <p>Car Details: {`${sale.order.auction.car.exteriorColor} ${sale.order.auction.car.make} ${sale.order.auction.car.model}`}</p>
                        </div>
                      )}
                    </td>
                    <td>
                      <Button variant="primary" size="sm" onClick={() => handleViewDetails(sale.saleID)}>
                        {expandedItem === sale.saleID ? 'View Less Details' : 'View All Details'}
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
            <Button variant="primary" size="sm" disabled={currentPage * recordsPerPage >= sellingHistory.length} onClick={handleNextPage}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUserSellingHistory;