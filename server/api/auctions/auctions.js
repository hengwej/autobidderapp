const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const csrfProtection = require('../../utils/CsrfUtils');
const checkJwtToken = require('../../utils/JwtTokens');

router.post('/allAuction', async (req, res) => {
    const allAuctions = await prisma.auction.findMany();
    res.json(allAuctions);
});

router.post('/addBid', csrfProtection, checkJwtToken, async (req, res) => {

    try {
        //Verify token
        const payload = req.user;

        const newBid = req.body;
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

router.put('/addOrder', csrfProtection, checkJwtToken, async (req, res) => {
    const { orderStatus, auctionID } = req.body;

    try {
        // Verify the token and extract the account ID
        const payload = req.user;
        const accountID = payload.accountID;

        // Check if there is an existing order with the same auction ID
        const existingOrder = await prisma.orders.findFirst({
            where: { auctionID: auctionID },
        });

        if (existingOrder) {
            // An existing order with the same auction ID is found.
            // Update that order with the new accountID
            const updatedOrder = await prisma.orders.update({
                where: { orderID: existingOrder.orderID },
                data: { accountID: accountID },
            });

            res.json(updatedOrder);

        } else {
            // No existing order found, create a new order.
            const newOrder = await prisma.orders.create({
                data: {
                    orderStatus: orderStatus,
                    auctionID: auctionID,
                    accountID: accountID,
                },
            });

            res.json(newOrder);
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }

        console.error("Error updating order data:", error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});

router.put('/completeOrder', async (req, res) => {

    const { orderStatus, auctionID } = req.body;

    try {
        const updateOrder = await prisma.orders.findFirst({
            where: { auctionID: auctionID },
        });

        if (updateOrder) {
            // An existing order with the same auction ID is found.
            // Update that order stauts with the new order status
            const updatedOrder = await prisma.orders.update({
                where: { orderID: updateOrder.orderID },
                data: { orderStatus: orderStatus },
            });

            res.json(updatedOrder);
        } else {
            // Order doesn't exists, do nothing
            res.json({ message: 'Order do not exists' });
        }
    } catch (error) {

        console.error("Error updating order data:", error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});

router.post('/addSellingHistory', csrfProtection, checkJwtToken, async (req, res) => {
    const { auctionID } = req.body;

    try {
        // Check if there is an existing order with the same auction ID
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

                res.json(sellingHistory);
            } else {
                // Selling history already exists, do nothing
                res.json({ message: 'Selling history already exists for this order.' });
            }
        } else {
            res.status(404).json({ error: 'Order not found' });
        }

    } catch (error) {
        console.error("Error creating history record:", error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});

module.exports = router;
