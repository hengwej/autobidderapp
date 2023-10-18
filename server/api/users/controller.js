const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.addUser = async (req, res) => {
    const newUser = await prisma.user.create({
        data: req.body,
    });
    res.json(newUser);
};




