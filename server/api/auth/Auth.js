const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const crypto = require('crypto');

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

        //generate 6 digit OTP
        const generateOTP = () => {
            // otp logic 
            const otp = crypto.randomInt(100000, 1000000); // This generates a value between 100000 (inclusive) and 1000000 (exclusive)
            return otp;
        }

        const generatedOtp = generateOTP();
        console.log(generatedOtp);

        userEmailAddress = '';

        //obtain user email
        try {

            const account = await prisma.account.findUnique({
                where: {
                    username: username,
                },
                include: {
                    user: true,
                },
            });

            if (account && account.user) {
                console.log(account.user.emailAddress);
                userEmailAddress = account.user.emailAddress;
                
            } else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }

        // Send out email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EPASSWORD
            }
        });



        const mailOptions = {
            from: process.env.EMAIL,
            to: userEmailAddress,
            subject: 'Autobidder OTP',
            text: generatedOtp.toString()
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                // do something useful
            }
        });


        //Store to backend


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
