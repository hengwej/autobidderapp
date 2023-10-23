const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = express.Router();
const prisma = new PrismaClient();
const saltRounds = 10;
const axios = require('axios'); //for recaptcha backend logic
const validator = require('validator');


//asynchronous recaptcha backend logic
async function verifyRecaptcha(token) { //takes the token arg from frontend
    const secretKey = process.env.RECAPTCHA_SERVER_KEY;
    console.log("Server CAPTCHA key is:", process.env.RECAPTCHA_SERVER_KEY);
    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`); //REMEMBER TO SWAP OUT TESTING KEY MR DARREN
        res.json(response.data); // this sends the response data back to the client
        console.log("RECAPTCHA successfully completed");
    } catch (error) {
        res.status(500).send(error.toString());
    }
}



// Middleware to validate JWT token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};




router.post('/signUp', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userData, accountData } = req.body;

    try {
        const user = await prisma.user.create({ data: userData });
        accountData.userID = user.userID;
        accountData.accountType = "bidder";
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

    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter both username and password' });
    }


    // validation and sanitisation
    // Check for illegal characters in username and password
    if (validator.matches(username, /[<>]/) || validator.matches(password, /[<>]/)) {
        return res.status(400).json({ message: 'Illegal characters detected' });
    }

    // Sanitize
    const sanitizedUsername = validator.escape(username);
    const sanitizedPassword = validator.escape(password);


    //resume backend logic
    try {
        const account = await prisma.account.findUnique({
            where: { username },
            include: { user: true },
        });

        if (!account || !(await bcrypt.compare(password, account.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const generatedOtp = crypto.randomInt(100000, 1000000).toString();
        console.log("Generated OTP: " + generatedOtp);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EPASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: account.user.emailAddress,
            subject: 'Autobidder OTP',
            text: generatedOtp.toString()
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: 'Error sending OTP' });
            }
            console.log('Email sent: ' + info.response);
        });

        // Create temporary session token
        const tempPayload = {
            accountID: account.accountID,
            otp: generatedOtp,
            timestamp: new Date(),
        };

        const tempToken = jwt.sign(tempPayload, process.env.JWT_TEMP_SECRET, { expiresIn: '10m' });

        // Send temporary token as a cookie
        res.cookie('tempToken', tempToken, { httpOnly: true, secure: true, sameSite: 'None' });

        return res.json({ message: 'OTP sent successfully. Please check your email.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});


router.post('/otp', async (req, res) => {
    const { otp } = req.body;

    try {
        const tempToken = req.cookies.tempToken;
        if (!tempToken) return res.status(401).json({ error: 'Temporary session not found' });

        // Verify temporary session token
        let tempUser;
        try {
            tempUser = jwt.verify(tempToken, process.env.JWT_TEMP_SECRET);
        } catch (error) {
            return res.status(401).json({ error: 'Invalid or expired temporary session' });
        }

        if (tempUser.otp !== otp) return res.status(401).json({ error: 'Invalid OTP' });

        //get accountType from account table
        const account = await prisma.account.findUnique({
            where: { accountID: tempUser.accountID },
        });

        if (!account) return res.status(401).json({ error: 'Account not found' });


        // OTP is valid, create a new fully authenticated session token
        const payload = {
            accountID: tempUser.accountID,
            accountType: account.accountType,
        };

        console.log("Payload: ", payload);

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' });
        res.clearCookie('tempToken');

        return res.json({ accountType: account.accountType, message: 'Logged in successfully.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});


router.post('/logout', (req, res) => {
    res.clearCookie('token', { path: '/', httpOnly: true, secure: true, sameSite: 'None' });
    res.json({ message: "Logged out successfully." });
});


module.exports = router;