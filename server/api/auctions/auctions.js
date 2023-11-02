const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const csrfProtection = require('../../utils/CsrfUtils');
const checkJwtToken = require('../../utils/JwtTokens');

/**
 * Endpoint to retrieve all auctions.
 * This endpoint fetches all auctions from the database and returns them in an array.
 * 
 * @route POST /allAuction
 * @returns {Object[]} allAuctions - The list of all auctions.
 */
router.post('/allAuction', async(req, res) => {
    try {
        const allAuctions = await prisma.auction.findMany();
        req.log.info("Successfully retrieved all auctions.");
        res.status(200).json(allAuctions);
    } catch (error) {
        if(req.log){
            req.log.error('Error fetching all auctions:', error);
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Endpoint to add a bid to an auction.
 * This endpoint first validates the JWT from cookies to ensure the user is authenticated.
 * Then, it attempts to add a bid to the specified auction.
 * 
 * @route POST /addBid
 * @param {Object} req.body - The bid details including carID and bidValue.
 * @returns {Object} - Updated auction details.
 */
router.post('/addBid', csrfProtection, checkJwtToken, async(req, res) => {
    req.log.info("Attempt to add a bid.");
    try {
        // Extract user payload from the JWT
        const payload = req.user;
        const newBid = req.body; // Retrieving bid details from the request body

        // Update the auction with the new bid details
        const addBid = await prisma.auction.updateMany({
            where: {
                carID: newBid.carID, // Matching the carID field
            },
            data: {
                currentHighestBid: newBid.bidValue, // Updating the currentHighestBid field
                accountID: payload.accountID, // Updating the accountID field
            },
        });
        req.log.info(`Successfully added bid for carID: ${newBid.carID}`);
        res.json(addBid); // Sending the updated auction details as a JSON response
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            req.log.error(`Token has expired: ${error}`);
            return res.status(401).json({ error: 'Token has expired' }); // If token is expired, send a 401 Unauthorized error response
        }
        req.log.error(`Error during bid addition: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' }); // For other errors, send a 500 Internal Server Error response
    }
});

/**
 * Endpoint to close an auction.
 * This endpoint updates the status of a specified auction to 'closed'.
 * 
 * @route POST /updateAuctionToClose
 * @param {Object} req.body - The auction details including auctionID and new status.
 * @returns {Object} - Updated auction details.
 */
router.post('/updateAuctionToClose', async(req, res) => {
    const closeAuction = req.body; // Retrieve auction details from request body
    try {
        // Update the auction status to 'closed'
        const updateClose = await prisma.auction.updateMany({
            where: {
                auctionID: closeAuction.auctionID, // Matching the auctionID field
            },
            data: {
                auctionStatus: closeAuction.status, // Updating the auctionStatus field
            },
        });
        req.log.info(`Successfully closed auction with auctionID: ${closeAuction.auctionID}`);
        res.json(updateClose);
    } catch (error) {
        req.log.error('Failed to close auction:', error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});

/**
 * Endpoint to add or update an order.
 * This endpoint first validates the JWT from cookies to ensure the user is authenticated.
 * Then, it either adds a new order or updates an existing order based on the auctionID.
 * 
 * @route PUT /addOrder
 * @param {Object} req.body - The order details including orderStatus and auctionID.
 * @returns {Object} - New or updated order details.
 */
router.put('/addOrder', csrfProtection, checkJwtToken, async(req, res) => {
    const { orderStatus, auctionID } = req.body; // Destructure orderStatus and auctionID from request body
    try {
        // Verify the token and extract the account ID
        const payload = req.user;
        const accountID = payload.accountID;

        // Check if there's an existing order for the specified auctionID
        const existingOrder = await prisma.orders.findFirst({
            where: { auctionID: auctionID },
        });
        if (existingOrder) {
            // An existing order is found, update it
            const updatedOrder = await prisma.orders.update({
                where: { orderID: existingOrder.orderID },
                data: { accountID: accountID },
            });
            req.log.info("Successfully updated existing order.");
            res.json(updatedOrder);
        } else {
            // No existing order found, create a new one
            const newOrder = await prisma.orders.create({
                data: {
                    orderStatus: orderStatus,
                    auctionID: auctionID,
                    accountID: accountID,
                },
            });
            req.log.info("Successfully created a new order.");
            res.json(newOrder);
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        req.log.error(`Error updating order data: ${error}`);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});

/**
 * Endpoint to complete an order.
 * This endpoint updates the status of a specified order to 'completed'.
 * 
 * @route PUT /completeOrder
 * @param {Object} req.body - The order details including orderStatus and auctionID.
 * @returns {Object} - Updated order details.
 */
router.put('/completeOrder', async(req, res) => {
    const { orderStatus, auctionID } = req.body; // Destructure orderStatus and auctionID from request body
    try {
        // Find the order with the specified auctionID
        const updateOrder = await prisma.orders.findFirst({
            where: { auctionID: auctionID },
        });
        if (updateOrder) {
            // An existing order is found, update its status
            const updatedOrder = await prisma.orders.update({
                where: { orderID: updateOrder.orderID },
                data: { orderStatus: orderStatus },
            });
            req.log.info("Successfully updated order status.");
            res.json(updatedOrder);
        } else {
            // No order found for the specified auctionID
            req.log.warn("Order does not exist.");
            res.json({ message: 'Order do not exists' });
        }
    } catch (error) {
        req.log.error('Failed to complete order:', error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});

/**
 * Endpoint to add a selling history record.
 * This endpoint first validates the JWT from cookies to ensure the user is authenticated.
 * Then, it adds a new selling history record for the specified auctionID.
 * 
 * @route POST /addSellingHistory
 * @param {Object} req.body - The auctionID to identify the relevant order.
 * @returns {Object} - New selling history record or error message.
 */
router.post('/addSellingHistory', csrfProtection, checkJwtToken, async(req, res) => {
    const { auctionID } = req.body; // Destructure auctionID from request body
    try {
        // Check if there's an existing order for the specified auctionID
        const existingOrder = await prisma.orders.findFirst({
            where: { auctionID: { equals: auctionID } },
            include: {
                auction: {
                    include: {
                        car: true
                    },
                }
            },
        });
        if (existingOrder) {
            // Check if a selling history already exists for this order
            const existingSellingHistory = await prisma.sellingHistory.findFirst({
                where: { orderID: existingOrder.orderID }
            });
            if (!existingSellingHistory) {
                // No existing selling history found, create a new one
                const sellingHistory = await prisma.sellingHistory.create({
                    data: {
                        orderID: existingOrder.orderID,
                        accountID: existingOrder.auction.car.accountID,
                    },
                });
                req.log.info("Successfully added new selling history record.");
                res.json(sellingHistory);
            } else {
                // Selling history already exists for this order, do nothing
                req.log.warn(`Selling history already exists for this order.`);
                res.json({ message: 'Selling history already exists for this order.' });
            }
        } else {
            req.log.warn(`Order not found: ${error}`);
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        req.log.error(`Error creating history record: ${error}`);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});

module.exports = router;