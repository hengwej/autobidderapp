const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const saltRounds = 10;

router.post('/signUp', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userData, accountData } = req.body;

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
    const { username, password } = req.body;

    try {
        const account = await prisma.account.findUnique({ where: { username } });

        if (!account || !(await bcrypt.compare(password, account.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Define payload
        const payload = {
            accountId: account.accountID,
            role: account.accountType
        };

        // Sign JWT
        const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });  // Replace 'your-secret-key' with your actual secret key

        // Send token in a cookie
        //res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' });


        return res.json({ message: 'Logged in successfully.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});


router.post('/logout', (req, res) => {
    res.clearCookie('token', { path: '/', secure: true, sameSite: 'None' });
    res.json({ message: "Logged out successfully." });
});



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
