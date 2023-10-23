// ./api/stripe/index.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Map the URL to the controller function
router.post('/create-payment-intent', controller.createPaymentIntent);

// More routes can be added here as you expand your Stripe integration
module.exports = router;
