import "../../../css/styles.css";
import "./styles.css";

// client/src/pages/Users/Payment/payment.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './styles.css'

const item = {
    name: 'Awesome Item',
    price: 50
};

export default function PaymentForm() {


    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false); // Add state for button click processing
    const [paymentError, setPaymentError] = useState(null); // State to hold payment errors
    const navigate = useNavigate(); // useNavigate for navigation

    const handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();
        setIsProcessing(true);
        setPaymentError(null); // Clear out any previous errors


        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const cardElement = elements.getElement(CardElement);

        // Use your card Element with other Stripe.js APIs
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.log('[error]', error);
            setIsProcessing(false);
            setPaymentError(error.message || 'Payment failed'); // Set the error message
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            const response = await axios.post('/api/stripe/create-payment-intent', {
                amount: item.price, // Replace with the amount you want to charge
                currency: 'usd'
            });

            const clientSecret = response.data.clientSecret;

            const {error: confirmError} = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id
            });

            if (confirmError) {
                // Show error to your customer (e.g., insufficient funds)
                console.log(confirmError.message);
                setPaymentError(error.message || 'Payment failed');
            } else {
                // The payment has been processed!
                console.log('Payment successful!');
                // You can redirect to another page here
                navigate('/payment-success'); // Navigate to success page
            }
            setIsProcessing(false);
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
            <h2>{item.name}</h2> {/* Display item name */}
            <p>Price: ${item.price}</p> {/* Display item price */}
            {/* Display payment error message if payment fails */}
            {paymentError && <div className="payment-error">{paymentError}</div>}
            
            <form onSubmit={handleSubmit} className="payment-form">
                <CardElement options={CARD_ELEMENT_OPTIONS} className="card-element"/>
                <button type="submit" disabled={!stripe || isProcessing}>
                    {isProcessing ? "Processing..." : "Pay"}
                </button>
            </form>
        </div>
    );
}
