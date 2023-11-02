const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

const csrfProtection = require('../../utils/CsrfUtils');
const checkJwtToken = require('../../utils/JwtTokens');

/**
 * Endpoint to retrieve all bidding history records.
 * This endpoint fetches all bidding history records from the database and returns them in an array.
 * 
 * @route GET /allBidHistory
 * @returns {Object[]} allBiddingHistory - The list of all bidding history records.
 */
router.get('/allBidHistory', csrfProtection, checkJwtToken, async (req, res) => {
    try {
        req.log.info('Fetching all bidding history');
        const allBiddingHistory = await prisma.biddingHistory.findMany();
        req.log.info('Successfully fetched all bidding history');
        res.json(allBiddingHistory);
    } catch (error) {
        req.log.error(`Error fetching all bidding history: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Endpoint to add or update a bid history record.
 * This endpoint either adds a new bidding history record or updates an existing one based on the auctionID and accountID.
 * 
 * @route POST /addBidHistory
 * @param {Object} req.body - The bid history details including bidValue, status, and auctionID.
 * @returns {Object} - New or updated bid history record.
 */
router.post('/addBidHistory', csrfProtection, checkJwtToken, async (req, res) => {
    try {
        req.log.info('Processing bid history');
        const payload = req.user;  // Assuming checkJwtToken middleware sets req.user
        let newBidHistory = req.body;

        // Check if a bidding history record already exists for the specified auctionID and accountID
        const existingBiddingHistory = await prisma.biddingHistory.findFirst({
            where: {
                AND: [
                    { accountID: payload.accountID },
                    { auctionID: req.body.auctionID },
                ],
            },
            include: {
                auction: {
                    include: {
                        car: true,
                    },
                },
            },
        });

        if (existingBiddingHistory) {
            req.log.info('Updating existing bid history');
            // Update the existing bidding history record
            const updatedBiddingHistory = await prisma.biddingHistory.updateMany({
                where: {
                    AND: [
                        { accountID: payload.accountID },
                        { auctionID: req.body.auctionID },
                    ],
                },
                data: {
                    bidAmount: newBidHistory.bidValue,
                },
            });
            req.log.info('Successfully updated existing bid history');
            res.json(updatedBiddingHistory);
        } else {
            req.log.info('Creating new bid history');
            // Create a new bidding history record
            const newBiddingHistory = await prisma.biddingHistory.create({
                data: {
                    accountID: payload.accountID,
                    bidAmount: newBidHistory.bidValue,
                    bidStatus: newBidHistory.status,
                    auctionID: newBidHistory.auctionID,
                    bidTimestamp: new Date(),
                },
            });
            req.log.info('Successfully created new bid history');
            res.json(newBiddingHistory);
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            req.log.error(`Token has expired: ${error}`);
            return res.status(401).json({ error: 'Token has expired' });
        }
        req.log.error(`Error processing bid history: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Endpoint to update the status of a bid history record to 'end'.
 * This endpoint updates the status of all bidding history records associated with a specified auctionID to 'end'.
 * 
 * @route POST /updateBidHistoryToEnd
 * @param {Object} req.body - The bid history details including status and auctionID.
 * @returns {Object} - Updated bid history record(s).
 */
router.post('/updateBidHistoryToEnd', async (req, res) => {
    try {
        req.log.info('Updating bid history to end');
        let endBidHistory = req.body;

        // Update the status of all bidding history records associated with the specified auctionID to 'end'
        const updateEndBiddingHistory = await prisma.biddingHistory.updateMany({
            where: {
                auctionID: endBidHistory.auctionID,
            },
            data: {
                bidStatus: endBidHistory.status,
            },
        });
        req.log.info('Successfully updated bid history to end');
        res.json(updateEndBiddingHistory);
    } catch (error) {
        req.log.error(`Error updating bid history to end: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
