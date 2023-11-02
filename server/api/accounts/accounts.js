const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.post('/addAccount', async (req, res) => {
    const newAccount = await prisma.account.create({
        data: req.body,
    });
    res.json(newAccount);
});

router.get('/allAccount', async (req, res) => {
    const allAccounts = await prisma.account.findMany();
    res.json(allAccounts);
});

module.exports = router;