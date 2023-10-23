import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Table, Button, Container, Dropdown, Row, Col } from 'react-bootstrap';
import './styles.css';

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
  const [sortBy, setSortBy] = useState("orderID"); // Default sort by orderID
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order ascending
  const [sortingFilter, setSortingFilter] = useState(""); // Default no sorting filter
  const [orderStatusFilter, setOrderStatusFilter] = useState(""); // Default no status filter

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
    // Create a copy of the sellingHistory to avoid modifying the original data
    let sortedSellingHistory = [...sellingHistory];
  
    // Filter by order status
    if (orderStatusFilter === "Completed Orders") {
      sortedSellingHistory = sortedSellingHistory.filter(sale => sale.order.orderStatus.toLowerCase() === "completed");
    } else if (orderStatusFilter === "Pending Orders") {
      sortedSellingHistory = sortedSellingHistory.filter(sale => sale.order.orderStatus.toLowerCase() === "pending");
    } else if (orderStatusFilter === "Incompleted Orders") {
      sortedSellingHistory = sortedSellingHistory.filter(sale => sale.order.orderStatus.toLowerCase() === "incompleted");
    }
  
    // Sort the filtered data
    sortedSellingHistory.sort((a, b) => {
      if (sortBy === "orderTimestamp") {
        const timestampA = new Date(a.sale.order.orderCompletionTime).toLocaleString({ timeZone: 'Asia/Singapore' });
        const timestampB = new Date(b.sale.order.orderCompletionTime).toLocaleString({ timeZone: 'Asia/Singapore' });
        return sortOrder === "asc" ? new Date(timestampA) - new Date(timestampB) : new Date(timestampB) - new Date(timestampA);
      } else if (sortBy === "amount") {
        return sortOrder === "asc" ? a.sale.order.auction.currentHighestBid - b.sale.order.auction.currentHighestBid : b.sale.order.auction.currentHighestBid - a.sale.order.auction.currentHighestBid;
      } else if (sortBy === "orderID") {
        return sortOrder === "asc" ? a.sale.orderID - b.sale.orderID : b.sale.orderID - a.sale.orderID;
      }
      return 0;
    });
  
    // Calculate the number of pages
    const totalRecords = sortedSellingHistory.length;
    const numPages = Math.ceil(totalRecords / recordsPerPage);
    setNumPages(numPages);

    // Calculate the range of records to display for the current page
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, totalRecords);
    
    // Set the displayed records based on the range
    setDisplayedHistory(sortedSellingHistory.slice(startIndex, endIndex));
  }, [sellingHistory, currentPage, sortBy, sortOrder, orderStatusFilter]);

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
                  <Dropdown.Item onClick={() => {setOrderStatusFilter("Completed Orders"); setCurrentPage(1);}}>Completed Orders</Dropdown.Item>
                  <Dropdown.Item onClick={() => {setOrderStatusFilter("Pending Orders"); setCurrentPage(1);}}>Pending Orders</Dropdown.Item>
                  <Dropdown.Item onClick={() => {setOrderStatusFilter("Incompleted Orders"); setCurrentPage(1);}}>Incompleted Orders</Dropdown.Item>
                  <Dropdown.Item onClick={() => {setOrderStatusFilter(""); setCurrentPage(1);}}>Clear Status Filter</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col>
              <Dropdown className="d-flex justify-content-end Filter-dropdown">
                <Dropdown.Toggle variant="primary" size="sm" id="orderSortingFilterDropdown">
                  Sort By: {sortingFilter || "None"}
                </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => {setSortingFilter("Oldest Order First"); setSortBy("orderTimestamp"); setSortOrder("asc"); setCurrentPage(1);}}>Oldest Order First</Dropdown.Item>
                <Dropdown.Item onClick={() => {setSortingFilter("Newest Order First"); setSortBy("orderTimestamp"); setSortOrder("desc"); setCurrentPage(1);}}>Newest Order First</Dropdown.Item>
                <Dropdown.Item onClick={() => {setSortingFilter("Lowest Amount First"); setSortBy("amount"); setSortOrder("asc"); setCurrentPage(1);}}>Lowest Amount First</Dropdown.Item>
                <Dropdown.Item onClick={() => {setSortingFilter("Highest Amount First"); setSortBy("amount"); setSortOrder("desc"); setCurrentPage(1);}}>Highest Amount First</Dropdown.Item>
                <Dropdown.Item onClick={() => {setSortingFilter("None"); setSortBy("orderID"); setSortOrder("asc"); setCurrentPage(1);}}>Clear Sorting Filter</Dropdown.Item>
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
            <Button variant="primary" size="sm" className="Page-button" disabled={currentPage * recordsPerPage >= sellingHistory.length} onClick={handleNextPage}>Next</Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ViewUserSellingHistory;