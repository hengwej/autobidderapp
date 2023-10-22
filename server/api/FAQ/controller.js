const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.getAllFAQs = async (req, res) => {
    const allFaqs = await prisma.FAQ.findMany();
    res.json(allFaqs);
};
