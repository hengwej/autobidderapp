// teardown.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async () => {
    // Disconnect Prisma Client and perform cleanup
    await prisma.$disconnect();
};
