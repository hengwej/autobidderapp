const express = require('express');
const router = express.Router();
const csrfProtection = require('../../utils/CsrfUtils');
const checkJwtToken = require('../../utils/JwtTokens');

/**
 * Endpoint to create a payment intent using Stripe.
 * @route POST /create-payment-intent
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/create-payment-intent', csrfProtection, checkJwtToken, async (req, res) => {
    try {
        const { amount, currency } = req.body;

        // Validate the received amount and currency
        if (!amount || !currency) {
            req.log.warn('Amount and currency are required.');  // Updated logging method
            return res.status(400).send({ statusCode: 400, message: 'Amount and currency are required.' });
        }
        // Logging the start of payment intent creation
        req.log.info(`Creating payment intent for amount: ${amount} and currency: ${currency}`);  // Updated logging method
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            // Verify your integration in this guide by including this parameter
            // metadata: { integration_check: 'accept_a_payment' },  // commented to prep for production
        });
        // Logging successful creation of payment intent
        req.log.info(`Payment intent created successfully with ID: ${paymentIntent.id}`);  // Updated logging method
        // Send publishable key and PaymentIntent details to client
        res.send({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        req.log.error(`Error creating payment intent: ${error.message}`);  // Updated logging method
        res.status(500).send({ statusCode: 500, message: error.message });
    }
});

module.exports = router;