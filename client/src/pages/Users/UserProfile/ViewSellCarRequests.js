import React, { useEffect, useState } from "react";
import { Table, Button, Container, Dropdown, Row, Col, Modal } from 'react-bootstrap';
import './styles.css';
import * as api from '../../../utils/UserProfileAPI';

const ViewSellCarRequests = () => {
  const [sellCarRequests, setSellCarRequests] = useState([]);
  const [displayedRequests, setDisplayedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Image Display
  const [showImageModal, setShowImageModal] = useState(false); // State to control the image modal
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image

  // Table Page
  const [expandedItem, setExpandedItem] = useState(null);
  const recordsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);

  // Sorting and Filtering
  const [requestStatusFilter, setRequestStatusFilter] = useState(""); // Default no status filter
  const [sortingFilter, setSortingFilter] = useState(""); // Default no sorting filter
  const [sortBy, setSortBy] = useState("requestID"); // Default sort by requestID
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order ascending

  useEffect(() => {
    async function fetchUserSellCarRequests() {
      try {
        const response = await api.userSellCarRequests();
        if (response.status === 200) {
            setSellCarRequests(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserSellCarRequests();

  }, []);

  useEffect(() => {
    // Create a copy of the sellCarRequests to avoid modifying the original data
    let sortedSellCarRequests = [...sellCarRequests];

    // Filter by request status
    if (requestStatusFilter === "Approved Requests") {
        sortedSellCarRequests = sortedSellCarRequests.filter(request => request.requestStatus.toLowerCase() === "approved");
    } else if (requestStatusFilter === "Pending Requests") {
        sortedSellCarRequests = sortedSellCarRequests.filter(request => request.requestStatus.toLowerCase() === "pending");
    } else if (requestStatusFilter === "Rejected Requests") {
        sortedSellCarRequests = sortedSellCarRequests.filter(request => request.requestStatus.toLowerCase() === "rejected");
    }

    // Sort the filtered data
    sortedSellCarRequests.sort((a, b) => {
        if (sortBy === "requestSubmissionTime") {
            const timestampA = new Date(a.requestSubmissionTime).toLocaleString({ timeZone: 'Asia/Singapore' });
            const timestampB = new Date(b.requestSubmissionTime).toLocaleString({ timeZone: 'Asia/Singapore' });
            return sortOrder === "asc" ? new Date(timestampA) - new Date(timestampB) : new Date(timestampB) - new Date(timestampA);
        } else if (sortBy === "requestID") {
            return sortOrder === "asc" ? a.requestID - b.requestID : b.requestID - a.requestID;
        }
        return true;
    });

    // Calculate the number of pages
    const totalRecords = sortedSellCarRequests.length;
    const numPages = Math.ceil(totalRecords / recordsPerPage);
    setNumPages(numPages);

    // Calculate the range of records to display for the current page
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, totalRecords);

    // Set the displayed records based on the range
    setDisplayedRequests(sortedSellCarRequests.slice(startIndex, endIndex));
  }, [sellCarRequests, currentPage, sortBy, sortOrder, requestStatusFilter]);

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

  const handleViewImage = (imageData) => {
    setSelectedImage(imageData);
    setShowImageModal(true);
  };

  return (
    <Container fluid>
      <h3>Sell Car Requests</h3>
      {loading ? (
        <p>Loading sell car requests...</p>
      ) : sellCarRequests.length === 0 ? (
        <p>Error: No records found</p>
      ) : (
        <div>
            <Row>
                <Col>
                    <Dropdown className="d-flex justify-content-start Filter-dropdown">
                        <Dropdown.Toggle variant="primary" size="sm" id="orderStatusFilterDropdown">
                        Filter By: {requestStatusFilter || "None"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                        <Dropdown.Item onClick={() => { setRequestStatusFilter("Approved Requests"); setCurrentPage(1); }}>Approved Requests</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setRequestStatusFilter("Pending Requests"); setCurrentPage(1); }}>Pending Requests</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setRequestStatusFilter("Rejected Requests"); setCurrentPage(1); }}>Rejected Requests</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setRequestStatusFilter(""); setCurrentPage(1); }}>Clear Status Filter</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col>
                    <Dropdown className="d-flex justify-content-end Filter-dropdown">
                        <Dropdown.Toggle variant="primary" size="sm" id="bidSortingFilterDropdown">
                        Sort By: {sortingFilter || "None"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                        <Dropdown.Item onClick={() => { setSortingFilter("Oldest Request First"); setSortBy("requestSubmissionTime"); setSortOrder("asc"); setCurrentPage(1); }}>Oldest Request First</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSortingFilter("Newest Request First"); setSortBy("requestSubmissionTime"); setSortOrder("desc"); setCurrentPage(1); }}>Newest Request First</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSortingFilter("None"); setSortBy("requestID"); setSortOrder("asc"); setCurrentPage(1); }}>Clear Sorting Filter</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            <Table className="TableHeader-grey">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Details</th>
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedRequests.map((request) => (
                        <React.Fragment key={request.requestID}>
                        <tr>
                            <td>{request.requestID}</td>
                            <td>
                            <div className="UserProfileDetails">
                                <p><span>Request Status:</span> {request.requestStatus}</p>
                                <p><span>Submission Time:</span> {new Date(request.requestSubmissionTime).toLocaleString({ timeZone: 'Asia/Singapore' })}</p>
                                <p><span>Vehicle Number:</span> {request.vehicleNumber}</p>
                                <p><span>Car Details:</span> {`${request.exteriorColor} ${request.make} ${request.model}`}</p>
                            </div>
                            {expandedItem === request.requestID && (
                                <div className="UserProfileDetails">
                                    <p><span>Car Interior Color:</span> {request.interiorColor}</p>
                                    <p><span>Car Highlights:</span> {request.highlights}</p>
                                    <p><span>Car Equipments:</span> {request.equipment}</p>
                                    <p><span>Car Modifications:</span> {request.modifications}</p>
                                    <p><span>Car Flaws:</span> {request.knownFlaws}</p>
                                    <p><span>Staring Bid:</span> {request.startingBid}</p>
                                    <p><span>Reserve Price:</span> {request.reservePrice}</p>
                                </div>
                            )}
                            </td>
                            <td>
                                <Button variant="primary" size="sm" className="HistoryTable-button" onClick={() => handleViewImage(request.carImage)}>View Image</Button>
                            </td>
                            <td>
                                <Button variant="primary" size="sm" className="HistoryTable-button" onClick={() => handleViewDetails(request.requestID)}>
                                    {expandedItem === request.requestID ? 'View Less' : 'View More'}
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
            <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Car Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedImage && (
                        <img src={URL.createObjectURL(new Blob([new Uint8Array(selectedImage.data)]))} alt="Car" style={{ maxWidth: '100%' }}/>
                    )}
                </Modal.Body>
            </Modal>
        </div>
      )}
    </Container>
  );
};

export default ViewSellCarRequests;