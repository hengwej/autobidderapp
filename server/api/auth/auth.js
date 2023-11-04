const customValidator = require('../../utils/Validator');  // Import custom validator utility
const { sanitiseStr, sanitiseObj } = customValidator;  // Destructure and import sanitiseStr and sanitiseObj functions from customValidator
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = express.Router();  // Create an Express router instance
const prisma = new PrismaClient();  // Prisma Client instance for database operations
const saltRounds = 10;  // Number of rounds for bcrypt hashing
const axios = require('axios'); //for recaptcha backend logic

/**
 * Verifies the reCAPTCHA token received from the frontend.
 * @async
 * @function verifyRecaptcha
 * @param {string} token - The reCAPTCHA token from frontend.
 * @returns {Object} - Verification result from Google's reCAPTCHA API.
 */
async function verifyRecaptcha(token) { //takes the token arg from frontend
    const secretKey = process.env.RECAPTCHA_SERVER_KEY;  // Secret key for reCAPTCHA verification
    try {
        // Make a POST request to Google's reCAPTCHA API for verification
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`); //REMEMBER TO SWAP OUT TESTING KEY MR DARREN
        res.json(response.data);  // Send the verification result back to the client
        req.log.info("RECAPTCHA verified successfully");   // Log that the reCAPTCHA was verified successfully
    } catch (error) {
        req.log.warn(error.toString());  // Log the error if reCAPTCHA verification fails
        res.status(500).send(error.toString());   // Send a 500 status code with the error message
    }
}

/**
 * Generates a CSRF token.
 * @function
 * @returns {string} - A random CSRF token.
 */
function generateCSRFToken() {
    // Generate a random 64-byte value and convert it to a hexadecimal string
    return crypto.randomBytes(64).toString('hex');
}

/**
 * Middleware to validate JWT token and ensure the user is authenticated.
 * If the token is valid, the user object is attached to the request.
 * Otherwise, an error response is sent.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;  // Retrieve the token from cookies
    if (token == null) {
        // If the token is not present, log a warning and return a 401 status code
        req.log.warn('Authentication token missing');
        return res.sendStatus(401);
    }
    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // If there's an error in verification, log a warning and return a 403 status code
        if (err) {
            req.log.warn('Token verification failed');
            return res.sendStatus(403);
        }
        // Attach the user payload to the request object
        req.user = user;
        next();  // Continue to the next middleware or route handler
    });
};

/**
 * Endpoint to handle user signup.
 * This endpoint receives user data and account data, sanitizes the input, 
 * hashes the password, and then stores the user and account data in the database.
 * 
 * @route POST /signUp
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/signUp', async (req, res) => {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.log.warn('Validation errors during signup', errors.array()); // Log validation errors
        return res.status(400).json({ errors: errors.array() });
    }
    let { userData, accountData } = req.body;
    // Sanitise user input to prevent malicious data
    userData = sanitiseObj(userData);
    accountData = sanitiseObj(accountData);
    try {
        req.log.info('Processing signup request'); // Log signup request start
        // Create user and account in the database
        const user = await prisma.user.create({ data: userData });
        accountData.userID = user.userID;
        accountData.accountType = "bidder";
        accountData.accountStatus = "Active";
        const hashedPassword = await bcrypt.hash(accountData.password, saltRounds);
        accountData.password = hashedPassword;
        const account = await prisma.account.create({ data: accountData });
        req.log.info('Signup successful'); // Log signup request end
        res.json({ message: 'Signup successful!', user, account });
    } catch (error) {
        req.log.error(`Error during signup: ${error.message}`);  // Log signup request error
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * Endpoint to handle user login.
 * @route POST /login
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/login', async (req, res) => {
    let { username, password } = req.body;
    //sanitise str
    username = sanitiseStr(username);
    if (!username || !password) {
        req.log.warn('Incomplete login details provided');  // Log failed login attempt
        return res.status(400).json({ message: 'Please enter both username and password' });
    }
    //resume backend logic
    try {
        req.log.info('Processing login request');
        const account = await prisma.account.findUnique({
            where: { username },
            include: { user: true },
        });
        if (!account || !(await bcrypt.compare(password, account.password))) {
            req.log.warn('Invalid login credentials provided');  // Log Invalid credentials
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        //otp generation
        const generatedOtp = crypto.randomInt(100000, 1000000).toString();

        req.log.info('Generated OTP for login'); // Log Generated OTP for login request
        // console.log("Generated OTP: " + generatedOtp);
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
                req.log.error(`Error sending OTP: ${error}`);  // Log error sending OTP 
                return res.status(500).json({ error: 'Error sending OTP' });
            }
            req.log.info(`OTP email sent: ${info.response}`);
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
        req.log.info('OTP sent to user');  // log successful OTP sent
        //return res.status(200).json({ message: 'OTP sent successfully. Please check your email.' });

        const isTestEnvironment = process.env.REACT_APP_ENVIRONMENT === 'test';

        if (!isTestEnvironment) {
            return res.status(200).json({ message: 'OTP sent successfully. Please check your email.' });
        }
        else {
            return res.status(200).json({ message: 'OTP sent successfully. Please check your email.', tempToken });
        }

    } catch (error) {
        req.log.error(`Error during login: ${error.message}`);
        return res.status(500).json({ error: 'Server error' });
    }
});

/**
 * Endpoint to verify OTP.
 * @route POST /otp
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/otp', async (req, res) => {
    const { otp } = req.body;
    try {
        const tempToken = req.cookies.tempToken;
        const isTestEnvironment = process.env.REACT_APP_ENVIRONMENT === 'test';

        if (!tempToken) {
            req.log.warn('Temporary session not found');  // log temp session not found
            return res.status(401).json({ error: 'Temporary session not found' });
        }
        // Verify temporary session token
        let tempUser;
        try {
            tempUser = jwt.verify(tempToken, process.env.JWT_TEMP_SECRET);
        } catch (error) {
            req.log.warn('Invalid or expired temporary session');  // log invalid/expired temp session
            return res.status(401).json({ error: 'Invalid or expired temporary session' });
        }

        if (!isTestEnvironment) {
            if (tempUser.otp !== otp) {
                req.log.warn('Invalid OTP provided');  // log when invalid OTP
                return res.status(401).json({ error: 'Invalid OTP' });
            }
        }
        //get accountType from account table
        const account = await prisma.account.findUnique({
            where: { accountID: tempUser.accountID },
        });
        if (!account) {
            req.log.warn('Account not found');  // log when entered account not found
            return res.status(401).json({ error: 'Account not found' });
        }
        // OTP is valid, create a new fully authenticated session token
        const payload = {
            accountID: tempUser.accountID,
            accountType: account.accountType,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Generate CSRF token
        const csrfToken = generateCSRFToken();
        res.cookie('csrfToken', csrfToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        // Store the CSRF token in a secure, HttpOnly cookie
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' });
        res.clearCookie('tempToken');
        req.log.info('User authenticated successfully using OTP');  // log when login is successful
        return res.status(200).json({ accountType: account.accountType, csrfToken: csrfToken, message: 'Logged in successfully.' });
    } catch (error) {
        req.log.error(`Error during OTP verification: ${error.message}`);  // log when caught error
        return res.status(500).json({ error: 'Server error' });
    }
});

/**
 * Endpoint to fetch authenticated user details.
 * @route GET /user
 * @middleware authenticateToken - Middleware to validate JWT token.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/user', authenticateToken, async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        req.log.warn(`User not authenticated`);
        return res.status(200).json({ message: 'Not authenticated' });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.account.findUnique({
            where: { accountID: payload.accountID },
            select: { accountType: true },
        });
        if (!user) {
            req.log.warn('User not found'); // log when login user is not found
            return res.status(404).json({ error: 'User not found' });
        }
        req.log.info('User verified successfully');
        return res.status(200).json(user);
    } catch (error) {
        req.log.error(`Error fetching user: ${error.message}`);    // log when there is error caught
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

/**
 * Endpoint to handle user logout.
 * @route POST /logout
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/logout', (req, res) => {
    req.log.info('Logging out user');  // log start of logging out
    res.clearCookie('token', { path: '/', httpOnly: true, secure: true, sameSite: 'None' });
    res.clearCookie('csrfToken', { path: '/', httpOnly: true, secure: true, sameSite: 'Strict' });
    req.log.info('User logged out successfully');  // log end of logging out
    res.json({ message: "Logged out successfully." });
});

/**
 * Endpoint to refresh CSRF token.
 * @route POST /refreshCSRFToken
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/refreshCSRFToken', (req, res) => {
    const csrfToken = generateCSRFToken();
    res.cookie('csrfToken', csrfToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    req.log.info('CSRF token refreshed');
    res.json({ csrfToken: csrfToken });
});

module.exports = router;  // Export the router for use in the main application