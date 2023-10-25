const express = require('express');
const router = express.Router();
const controller = require('./controller');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/allBidHistory', controller.allBidHistory);

router.post('/addBidHistory', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        //Verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        //Perform Database calls here
        //Find account associated with the token by accountID
        const existingBiddingHistory = await prisma.biddingHistory.findFirst({
            where: {
                accountID: payload.accountID, // Use accountID from token payload
            },
            include: {
                auction: {
                    include: {
                        car: true,
                    },
                },
            },
        });

        const newBidHistory = req.body;

        if (existingBiddingHistory) {
            // If a record with the accountID exists, update it
            const updatedBiddingHistory = await prisma.biddingHistory.update({
                where: {
                    accountID: payload.accountID,
                },
                data: {
                    // Update the fields you want to change
                    // For example, update a 'bidValue' field
                    bidAmount: rnewBidHistory.bidValue,
                },
            });
            res.json(updatedBiddingHistory);
        } else {
            // If no record with the accountID exists, create a new record
            const newBiddingHistory = await prisma.biddingHistory.create({
                data: {
                    accountID: payload.accountID,
                    bidAmount: newBidHistory.bidValue,
                    bidStatus: newBidHistory.status,
                    auctionID: newBidHistory.auctionID,
                },
            });
            res.json(newBiddingHistory);
        }

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }

        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/updateBidHistoryToEnd', async (req, res) => {

    const endBidHistory  = req.body;

    const updateEndBiddingHistory = await prisma.biddingHistory.updateMany({
        where: {
            auctionID: endBidHistory.auctionID,
        },
        data: {
            bidStatus: endBidHistory.status,
        },
    });

    res.json(updateEndBiddingHistory);
  
});

module.exports = router;