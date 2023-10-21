const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.allAuction = async (req, res) => {
    const allAuctions = await prisma.auction.findMany();
    res.json(allAuctions);
};


exports.addAuction = async (req, res) => {
    const newAuction = await prisma.auction.create({
        data: req.body,
    });
    res.json(newAuction);
};

exports.addBid = async (req, res) => {
    const newBid = req.body;
    try {
        const addBid = await prisma.auction.updateMany({
            where: {
                carID: newBid.carID,
            },
            data: {
                currentHighestBid: newBid.bidValue,
            },
        });

        res.json(addBid);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "Bid not found." });
    }
};
