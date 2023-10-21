const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.allBidHistory = async (req, res) => {
    const allBiddingHistory = await prisma.biddingHistory.findMany();
    res.json(allBiddingHistory);
};


exports.createBidHistory = async (req, res) => {
    const newBidHistory = await prisma.auction.create({
        data: req.body,
    });
    res.json(newBidHistory);
};

exports.addBidHistory = async (req, res) => {
    const newBidAmount = req.body;
    try {
        const addBiddingHistory = await prisma.auction.updateMany({
            where: {
                accountID: newBidAmount.accountID,
            },
            data: {
                bidAmount: newBidAmount.bidValue,
            },
        });

        res.json(addBiddingHistory);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "Bid not found." });
    }
};
