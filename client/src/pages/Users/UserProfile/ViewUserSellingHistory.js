import React, { useEffect, useState } from "react";
import { Table, Button, Container, Dropdown, Row, Col } from 'react-bootstrap';
import './styles.css';
import * as api from '../../../utils/UserProfileAPI';

const ViewUserSellingHistory = () => {
  const [sellingHistory, setSellingHistory] = useState([]);
  const [displayedHistory, setDisplayedHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Table Page
  const [expandedItem, setExpandedItem] = useState(null);
  const recordsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);

  // Sorting and Filtering
  const [orderStatusFilter, setOrderStatusFilter] = useState(""); // Default no status filter

  useEffect(() => {
    async function fetchUserSellingHistory() {
      try {
        const response = await api.userSellingHistory();
        if (response.status === 200) {
          setSellingHistory(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch selling history:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserSellingHistory();

  }, []);

  useEffect(() => {
    // Create a copy of the sellingHistory to avoid modifying the original data
    let sortedSellingHistory = [...sellingHistory];

    // Filter by order status
    if (orderStatusFilter === "Completed Orders") {
      sortedSellingHistory = sortedSellingHistory.filter(sale => sale.order.orderStatus.toLowerCase() === "completed");
    } else if (orderStatusFilter === "Pending Orders") {
      sortedSellingHistory = sortedSellingHistory.filter(sale => sale.order.orderStatus.toLowerCase() === "pending");
    }

    // Calculate the number of pages
    const totalRecords = sortedSellingHistory.length;
    const numPages = Math.ceil(totalRecords / recordsPerPage);
    setNumPages(numPages);

    // Calculate the range of records to display for the current page
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, totalRecords);

    // Set the displayed records based on the range
    setDisplayedHistory(sortedSellingHistory.slice(startIndex, endIndex));
  }, [sellingHistory, currentPage, orderStatusFilter]);

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
          <Row>
            <Col>
              <Dropdown className="d-flex justify-content-start Filter-dropdown">
                <Dropdown.Toggle variant="primary" size="sm" id="orderStatusFilterDropdown">
                  Filter By: {orderStatusFilter || "None"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => { setOrderStatusFilter("Completed Orders"); setCurrentPage(1); }}>Completed Orders</Dropdown.Item>
                  <Dropdown.Item onClick={() => { setOrderStatusFilter("Pending Orders"); setCurrentPage(1); }}>Pending Orders</Dropdown.Item>
                  <Dropdown.Item onClick={() => { setOrderStatusFilter(""); setCurrentPage(1); }}>Clear Status Filter</Dropdown.Item>
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
            <Button variant="primary" size="sm" className="Page-button" disabled={currentPage >= numPages} onClick={handleNextPage}>Next</Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ViewUserSellingHistory;