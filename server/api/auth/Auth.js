const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { sign } = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const saltRounds = 10;

router.post('/signUp', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userData, accountData } = req.body;

    console.log("userData:", userData);
    console.log("accountData:", accountData);

    try {
        const user = await prisma.user.create({ data: userData });
        accountData.userID = user.userID;
        accountData.accountType = "Bidder";
        accountData.accountStatus = "Active";
        const hashedPassword = await bcrypt.hash(accountData.password, saltRounds);
        accountData.password = hashedPassword;
        const account = await prisma.account.create({ data: accountData });

        res.json({ message: 'Signup successful!', user, account });
    } catch (error) {
        console.error("Error processing signup:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body.accountData;

    const account = await prisma.account.findUnique({
        where: {
            username: username
        }
    });

    if (account == null) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, account.password);
    if (!match) {
        return res.status(400).json({ error: 'Invalid username or password' });
    } else {
        return res.json({ message: "Logged In successfully." });
        // Generate an access token
        const accessToken = sign({ username: account.username, accountID: account.accountID }, process.env.ACCESS_TOKEN_SECRET);

        // Set access token in a secure, httpOnly, sameSite cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });

        // Send CSRF token in the JSON response for your frontend to use in future requests
        res.json({ csrfToken: req.csrfToken() });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.json({ message: "Logged out successfully." });
});

//router.get('/csrf-token', (req, res) => {
//    res.json({ csrfToken: req.csrfToken() });
//});




router.post('/otp', async (req, res) => {
    const { username, password } = req.body;

    try {
        const account = await prisma.account.findUnique({
            where: {
                username: username
            }
        });
        if (account == null) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        if (account.accountStatus != "Active") {
            return res.status(400).json({ message: 'Account is not active' });
        }
        const match = await bcrypt.compare(password, account.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        await prisma.account.update({
            where: {
                username: username
            },
            data: {
                otp: otp
            }
        });
        // Code to send the OTP to the user would go here
    } catch (error) {
        console.error("Error processing login:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
