const express = require('express');
const router = express.Router();
const controller = require('./controller');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/allAuction', controller.allAuction);
router.post('/addAuction', controller.addAuction);

router.post('/addBid', async (req, res) => {
    console.log("access add bid");
    const token = req.cookies.token;
    console.log("token" + token);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        //Verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const  newBid = req.body;
        try {
            const addBid = await prisma.auction.updateMany({
                where: {
                    carID: newBid.carID,
                },
                data: {
                    currentHighestBid: newBid.bidValue,
                    accountID: payload.accountID,
                },
            });

            res.json(addBid);
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: "Bid not found." });
        }

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }

        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/updateAuctionToClose', async (req, res) => {
    
    const closeAuction = req.body;
   
    const updateClose = await prisma.auction.updateMany({
        where: {
            auctionID: closeAuction.auctionID,
        },
        data: {
            auctionStatus: closeAuction.status,
        },
    });

    res.json(updateClose);
    
});

module.exports = router;
