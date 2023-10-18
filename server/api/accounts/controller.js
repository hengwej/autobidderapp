const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.addAccount = async (req, res) => {
    const newAccount = await prisma.account.create({
        data: req.body,
    });
    res.json(newAccount);
};




