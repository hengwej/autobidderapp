import React, { useEffect, useState } from "react";
import "../../../css/styles.css";
import "./styles.css";
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Modal, Button } from "react-bootstrap";

export default function PlaceBid({ carID, handleClose  }) {
    const [auctionData, setAuctionData] = useState({});
    const [bidValue, setBidValue] = useState('');
    const [OpenedBid, setOpenedBid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentHighestBid, setCurrentHighestBid] = useState(null);
    const [bidError, setBidError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/auctions/allAuction");
                const data = await response.json();
                const auction = data.find((auction) => carID === auction.carID);

                setCurrentHighestBid(auction.currentHighestBid);
                setAuctionData(data);
                setLoading(false);

                const biddingHistoryResponse = await fetch("http://127.0.0.1:5000/api/biddingHistory/allBidHistory");
                const biddingHistoryData = biddingHistoryResponse.json();

            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error);
                setLoading(false);
            }
        }

        fetchData();
    }, [carID]);

    const handleCloseBid = () => {
        setOpenedBid(false);
    }
    const handleOpenBid = () => {
        setOpenedBid(true);
    }

    const bidOnIt = () => {
        if (bidValue < currentHighestBid) {
            setBidError("Your bid cannot be lower than the current highest bid. Please enter a higher bid.");
            return; // Prevent the bid from being submitted
        }
        setBidError(null); // Clear any previous error

        axios.post(`http://127.0.0.1:5000/api/auctions/addBid`, { bidValue: bidValue, carID: carID }).then((res) => {

            handleCloseBid();
            handleClose();
        });

        // Add to bidding history
        //axios.post(`http://127.0.0.1:5000/api/biddingHistory/addBidHistory`, { bidValue: bidValue }).then((res) => {
        //});

    }

    const onSubmit = (data) => {
        setBidValue(data.bid);
        setBidError(null);
        handleOpenBid();
    };

    return (
        <div>
            <Formik onSubmit={onSubmit} initialValues={{ bid: '' }}>
                <Form>
                    <label><b>Bidding Amount($):</b></label>&nbsp;
                    <Field type="number" id="bid" name="bid" style={{ width: 29.2 + 'em' }} /><br /><br />
                    <button className="btn btn-warning" type="submit" style={{ width: 29.2 + 'em' }}>Submit</button>
                </Form>
            </Formik>

            {/* This for Bidding */}
            <Modal
                show={OpenedBid} onHide={handleCloseBid}>
                <Modal.Header closeButton style={{ backgroundColor: 'lightyellow', width: 33 + 'em', position: 'relative', right: 1 + 'em' }}>
                    <Modal.Title>Are you sure you want to bid $<u style={{color: 'red'}}>{bidValue}</u>?</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: 'lightyellow', width: 33 + 'em', position: 'relative', right: 1 + 'em', height: 10 + 'em' }}>
                    <Button variant="secondary" onClick={handleCloseBid} className="cancel_btn">Cancel</Button>
                    <Button variant="success" onClick={bidOnIt} className="success_btn">Confirm</Button>
                    {bidError && <p style={{ color: 'red' }}>{bidError}</p>}
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: 'lightyellow', width: 33 + 'em', position: 'relative', right: 1 + 'em', height: 5 + 'em' }}/>
            </Modal>
        </div>
    );
}