const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();


router.get('/getAllFAQs', async (req, res) => {
    const allFAQs = await prisma.fAQ.findMany();
    res.json(allFAQs);
});

module.exports = router;