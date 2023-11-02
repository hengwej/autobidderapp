const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

const csrfProtection = require('../../utils/CsrfUtils');
const checkJwtToken = require('../../utils/JwtTokens');


router.get('/allBidHistory', csrfProtection, checkJwtToken, async (req, res) => {
    const allBiddingHistory = await prisma.biddingHistory.findMany();
    res.json(allBiddingHistory);
});

router.post('/addBidHistory', csrfProtection, checkJwtToken, async (req, res) => {
    console.log("access bid history");
    const token = req.cookies.token;
    console.log("token bid hist " + token);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    console.log(req.body);

    try {
        //Verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        //Perform Database calls here
        //Find account associated with the token by accountID
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

        const newBidHistory = req.body;
        //sanitise
        newBidHistory = sanitiseObj(newBidHistory);

        if (existingBiddingHistory) {
            // If a record with the accountID exists, update it
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

            res.json(updatedBiddingHistory);
        } else {
            // If no record with the accountID exists, create a new record
            const newBiddingHistory = await prisma.biddingHistory.create({
                data: {
                    accountID: payload.accountID,
                    bidAmount: newBidHistory.bidValue,
                    bidStatus: newBidHistory.status,
                    auctionID: newBidHistory.auctionID,
                    bidTimestamp: new Date(),
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

    let endBidHistory = req.body;
    //sanitisation
    //endBidHistory = sanitiseObj(endBidHistory);

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
