import React, { useEffect, useState } from "react";
import "../../../css/styles.css";
import "./styles.css";
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Modal, Button } from "react-bootstrap";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'; // Import Stripe components

export default function PlaceBid({ carID, handleClose  }) {
    const [auctionData, setAuctionData] = useState({});
    const [bidValue, setBidValue] = useState('');
    const [OpenedBid, setOpenedBid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentHighestBid, setCurrentHighestBid] = useState(null);
    const [bidError, setBidError] = useState(null);
    const [auctionID, setAuctionID] = useState(null);

    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false); // New state variable for tracking payment success


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/auctions/allAuction");
                const data = await response.json();
                const auction = data.find((auction) => carID === auction.carID);

                setCurrentHighestBid(auction.currentHighestBid);
                setAuctionID(auction.auctionID);
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

    useEffect(() => {
        if (paymentSuccess) {
            alert('Payment successful! The page will now refresh.'); // Alert the user
            window.location.reload(); // Refresh the page
        }
    }, [paymentSuccess]); // Dependency array

    const handleCloseBid = () => {
        setOpenedBid(false);
    }
    const handleOpenBid = () => {
        setOpenedBid(true);
    }

    const bidOnIt = async () => {
        setBidError(null);
        setIsProcessing(true);

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        const cardElement = elements.getElement(CardElement);

        // Use your card Element with other Stripe.js APIs
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.log('[error]', error);
            setIsProcessing(false);
            setPaymentError(error.message || 'Payment failed');
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            const response = await axios.post('/api/stripe/create-payment-intent', {
                amount: bidValue * 100, // Convert to cents and use bidValue
                currency: 'usd'
            });

            const clientSecret = response.data.clientSecret;

            const {error: confirmError} = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id
            });

            if (confirmError) {
                console.log(confirmError.message);
                setPaymentError(confirmError.message || 'Payment failed');
                setIsProcessing(false);
            } else {
                console.log('Payment successful!');
                // Record the bid in the database now that payment was successful
                await axios.post(`http://127.0.0.1:5000/api/auctions/addBid`, { bidValue: bidValue }, { withCredentials: true });
                // Close the modal and reset state
                handleCloseBid();
                handleClose();
                setIsProcessing(false);
                setPaymentSuccess(true);

                // Reload the page
                window.location.reload();
            }
        }

        // Add to bidding history
        axios.post(`http://127.0.0.1:5000/api/biddingHistory/addBidHistory`, { bidValue: bidValue, status: "ongoing", auctionID: auctionData.auctionID }, { withCredentials: true }).then((res) => {
        });
    };

    const onSubmit = (data) => {
        setBidValue(data.bid);
        if (data.bid < currentHighestBid) {
            const errorMessage = "Your bid cannot be lower than the current highest bid. Please enter a higher bid.";
            setBidError(errorMessage);
            console.log(errorMessage); // Log to see if this part of code executes
        } else {
            setBidError(null);
            handleOpenBid();
        }
    };
    

    const CARD_ELEMENT_OPTIONS = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#aab7c4"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    return (
        <div>
            <Formik onSubmit={onSubmit} initialValues={{ bid: '' }}>
                <Form>
                    <label><b>Bidding Amount($):</b></label>&nbsp;
                    <Field type="number" id="bid" name="bid" style={{ width: 29.2 + 'em' }} /><br /><br />
                    <button className="btn btn-warning" type="submit" style={{ width: 29.2 + 'em' }}>Submit</button>
                    {/* This should be somewhere appropriate in your return statement, where you want the error to show */}
                    {bidError && <p style={{ color: 'red' }}>{bidError}</p>}

                </Form>
            </Formik>

            {/* This for Bidding */}
            <Modal
                show={OpenedBid} onHide={handleCloseBid}>
                <Modal.Header closeButton style={{ backgroundColor: 'lightyellow', width: 33 + 'em', position: 'relative', right: 1 + 'em' }}>
                    <Modal.Title>Are you sure you want to bid $<u style={{color: 'red'}}>{bidValue}</u>?</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: 'lightyellow', width: 33 + 'em', position: 'relative', right: 1 + 'em', height: 10 + 'em' }}>
                    <CardElement options={CARD_ELEMENT_OPTIONS} className="card-element"/> {/* Stripe form */}
                    {paymentError && <div className="payment-error">{paymentError}</div>} {/* Display payment error */}
                    {paymentSuccess && <p>Payment successful! The page will refresh shortly.</p>}
                    <Button variant="secondary" onClick={handleCloseBid} className="cancel_btn">Cancel</Button>
                    <Button variant="success" onClick={bidOnIt} className="success_btn" disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "Confirm"}
                    </Button>
                    {bidError && <p style={{ color: 'red' }}>{bidError}</p>}
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: 'lightyellow', width: 33 + 'em', position: 'relative', right: 1 + 'em', height: 5 + 'em' }}/>
            </Modal>
        </div>
    );
}