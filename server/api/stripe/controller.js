// ./api/stripe/controller.js
const stripe = require('stripe')(process.env.STRIPE_SK);

exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            // Verify your integration in this guide by including this parameter
            metadata: {integration_check: 'accept_a_payment'},
        });

        // Send publishable key and PaymentIntent details to client
        res.send({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(500).send({ statusCode: 500, message: error.message });
    }
};

// Add more Stripe-related endpoints as needed
