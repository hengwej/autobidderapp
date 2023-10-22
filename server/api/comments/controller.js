const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.allComment = async (req, res) => {
    const allComments = await prisma.comment.findMany();
    res.json(allComments);
};