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
