const customValidator = require('../../utils/Validator');
const { sanitiseStr, sanitiseObj } = customValidator;
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
const { createLogWrapper } = require('../Log/log');  // Import createLogWrapper
const log = createLogWrapper();  // Create a wrapped logger instance


//asynchronous recaptcha backend logic
async function verifyRecaptcha(token) { //takes the token arg from frontend
    const secretKey = process.env.RECAPTCHA_SERVER_KEY;
    console.log("Server CAPTCHA key is:", process.env.RECAPTCHA_SERVER_KEY);
    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`); //REMEMBER TO SWAP OUT TESTING KEY MR DARREN
        res.json(response.data); // this sends the response data back to the client
        log.info("RECAPTCHA verified successfully");  // log captcha verified
        console.log("RECAPTCHA successfully completed");

    } catch (error) {
        log.warn(error.toString());  // log RECAPTCHA verified unsuccessfully
        res.status(500).send(error.toString());
    }
}

function generateCSRFToken() {
    return crypto.randomBytes(64).toString('hex');
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
        log.warn(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    let { userData, accountData } = req.body;
    //sanitise
    console.log('Old user inputs: Account Data - ' + JSON.stringify(accountData) + ', User Data - ' + JSON.stringify(userData));
    // const username =  validator.escape(accountData.username);
    userData = sanitiseObj(userData);
    accountData = sanitiseObj(accountData);
    console.log('New user inputs: Account Data - ' + JSON.stringify(accountData) + ', User Data - ' + JSON.stringify(userData));
    try {
        log.info('Received a signup request');  // Log signup request start
        const user = await prisma.user.create({ data: userData });
        accountData.userID = user.userID;
        accountData.accountType = "bidder";
        accountData.accountStatus = "Active";
        const hashedPassword = await bcrypt.hash(accountData.password, saltRounds);
        accountData.password = hashedPassword;
        const account = await prisma.account.create({ data: accountData });
        log.info('Signup request successful');  // Log signup request end
        res.json({ message: 'Signup successful!', user, account });
    } catch (error) {
        log.error(`Error processing signup: ${error.message}`);  // Log signup request error
        console.error("Error processing signup:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    let { username, password } = req.body;
    //sanitise str
    username = sanitiseStr(username);

    console.log('Login Inputs: User - ' + JSON.stringify(username) + ', User Data - ' + JSON.stringify(password));
    if (!username || !password) {
        log.warn('Wrong username / password entered');  // Log failed login attempt
        return res.status(400).json({ message: 'Please enter both username and password' });
    }

    //resume backend logic
    try {
        const account = await prisma.account.findUnique({
            where: { username },
            include: { user: true },
        });

        if (!account || !(await bcrypt.compare(password, account.password))) {
            log.warn('Invalid credentials');  // Log Invalid credentials
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        //otp generation
        const generatedOtp = crypto.randomInt(100000, 1000000).toString();
        log.info("Generated OTP for login request");  // Log Generated OTP for login request
        console.log("Generated OTP: " + generatedOtp);
        //nodemailer backend
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
                log.error(`${error}: "Error sending OTP`);  // Log error sending OTP 
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

        // Generate CSRF token
        const csrfToken = generateCSRFToken();

        res.cookie('csrfToken', csrfToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        log.info("OTP sent to user successfully.");  // log successful OTP sent
        return res.status(200).json({ message: 'OTP sent successfully. Please check your email.' });

    } catch (error) {
        log.error(`${error}: Server error`);
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.post('/otp', async (req, res) => {
    const { otp } = req.body;

    try {
        const tempToken = req.cookies.tempToken;
        if (!tempToken) {
            log.warn(`${error}: Temporary session not found`);  // log temp session not found
            return res.status(401).json({ error: 'Temporary session not found' });
        }

        // Verify temporary session token
        let tempUser;
        try {
            tempUser = jwt.verify(tempToken, process.env.JWT_TEMP_SECRET);
        } catch (error) {
            log.warn(`${error}: Invalid or expired temporary session`);  // log invalid/expired temp session
            return res.status(401).json({ error: 'Invalid or expired temporary session' });
        }

        if (tempUser.otp !== otp) {
            log.warn(`${error}: Invalid OTP`);  // log when invalid OTP
            return res.status(401).json({ error: 'Invalid OTP' });
        }

        //get accountType from account table
        const account = await prisma.account.findUnique({
            where: { accountID: tempUser.accountID },
        });

        if (!account) {
            log.warn(`${error}: Account not found`);  // log when entered account not found
            return res.status(401).json({ error: 'Account not found' });
        }

        // OTP is valid, create a new fully authenticated session token
        const payload = {
            accountID: tempUser.accountID,
            accountType: account.accountType,
        };

        console.log("Payload: ", payload);

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Generate CSRF token
        const csrfToken = generateCSRFToken();

        res.cookie('csrfToken', csrfToken, { httpOnly: true, secure: true, sameSite: 'Strict' });

        // Store the CSRF token in a secure, HttpOnly cookie
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' });
        res.clearCookie('tempToken');

        log.info("Login is sucessfully");  // log when login is successful
        return res.status(200).json({ accountType: account.accountType, csrfToken: csrfToken, message: 'Logged in successfully.' });

    } catch (error) {
        log.error(`${error}: server error`);  // log when caught error
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.get('/user', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        log.warn(`User not authenticated`);
        return res.status(200).json({ message: 'Not authenticated' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.account.findUnique({
            where: { accountID: payload.accountID },
            select: { accountType: true },
        });

        if (!user) {
            log.warn(`${error}: user not found`)  // log when login user is not found
            return res.status(404).json({ error: 'User not found' });
        }
        log.info(`user verified: ${user}`);
        return res.status(200).json(user);
    } catch (error) {
        log.error(`${error}: server error`);  // log when there is error caught
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});


router.post('/logout', (req, res) => {
    log.info(`logging out`);  // log start of logging out
    res.clearCookie('token', { path: '/', httpOnly: true, secure: true, sameSite: 'None' });
    res.clearCookie('csrfToken', { path: '/', httpOnly: true, secure: true, sameSite: 'Strict' });
    log.info(`Logged out successfully`)  // log end of logging out
    res.json({ message: "Logged out successfully." });
});

router.post('/refreshCSRFToken', (req, res) => {
    const csrfToken = generateCSRFToken();
    res.cookie('csrfToken', csrfToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.json({ csrfToken: csrfToken });
});

module.exports = router;