const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
const router = express.Router();
const prisma = new PrismaClient();
const sharp = require('sharp');
const path = require('path');
const sanitizeFilename = require('sanitize-filename');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { DateTime } = require('luxon');
const csrfProtection = require('../../utils/CsrfUtils');
const checkJwtToken = require('../../utils/JwtTokens');

router.use(cookieParser());  // Middleware for parsing cookies from the client



/**
 * Function to handle image processing, resizing, and compression.
 * @param {Object} file - The uploaded file object.
 * @returns {Buffer} - The processed image buffer.
 */
const handleImageProcessing = async (file) => {
    if (!file || !file.originalname) {
        throw new Error('Invalid file object');
    }
    const sanitizedFilename = sanitizeFilename(file.originalname);
    const inputPath = file.path;
    const outputPath = path.join(__dirname, '..', '..', 'processed_car_images', sanitizedFilename);
    const extension = path.extname(sanitizedFilename).toLowerCase();
    if (!extension || !['.jpg', '.png'].includes(extension)) {
        throw new Error('Invalid file type. Only jpg and png image files are allowed.');
    }
    const mimeTypeExtension = file.mimetype.split('/')[1];
    if (!mimeTypeExtension || !['jpeg', 'png'].includes(mimeTypeExtension)) {
        throw new Error('Invalid file type. Only jpg and png image files are allowed.');
    }
    if (!file.mimetype || !['image/jpeg', 'image/png'].includes(file.mimetype)) {
        throw new Error('Invalid file type. Only jpg and png image files are allowed.');
    }
    // Resize image to width of 600px and compress it
    await sharp(inputPath)
        .resize({ width: 600 })
        .jpeg({ quality: 80 })
        .withMetadata({ clone: false })  // Strip metadata
        .toFile(outputPath);
    const fileBuffer = await fs.readFile(outputPath);
    return fileBuffer;
};

// Configure multer for handling multipart/form-data (file uploads)
const upload = multer({
    dest: path.join(__dirname, '..', '..', 'uploads'),
    limits: { fileSize: 1000000 }, // limit file size to 1MB
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }
        const allowedMimes = ['image/jpeg', 'image/png'];
        if (!allowedMimes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only jpg and png image files are allowed.'));
        }
        cb(null, true);
    },
    onError: function (err, next) {
        next(err);
    }
});

/**
 * Route to fetch all car entries from the database.
 * @route GET /allCar
 */
router.get('/allCar', async (req, res, next) => {
    try {
        const allCars = await prisma.car.findMany();
        res.json(allCars);
    } catch (error) {
        // Log the error (optional)
        req.log.error(`Error fetching all cars: ${error.message}`);
        // Pass the error to the next middleware function
        next(error);
    }
});

/**
 * Route to add a new car entry to the database.
 * @route POST /addCar
 */
router.post('/addCar', async (req, res, next) => {
    try {
        const newCar = await prisma.car.create({
            data: req.body,
        });
        req.log.info(`User added a new car: ${JSON.stringify(newCar)}`);
        res.json(newCar);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        req.log.error(`Error adding a new car: ${error.message}`);
        next(error);  // Pass the error to the error handling middleware
    }
});

/**
 * Route to request to list a car for selling.
 * @route POST /sellCar
 */
router.post('/sellCar',
    upload.single('images'), // Use multer middleware to handle file upload
    [
        // Express-Validator Middleware to Validate and Sanitize Data
        check('vehicleNumber').isString().trim().escape(),
        check('highlights').isString().trim().escape(),
        check('equipment').isString().trim().escape(),
        check('modification').isString().trim().escape(),
        check('known_flaws').isString().trim().escape(),
        check('make').isString().trim().escape(),
        check('model').isString().trim().escape(),
        check('interiorColor').isString().trim().escape(),
        check('exteriorColor').isString().trim().escape(),
        check('startingBid').isNumeric().trim().escape(),
        check('reservePrice').isNumeric().trim().escape(),
    ], csrfProtection, checkJwtToken, async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation Error');
            error.statusCode = 400;
            error.validation = errors.array();
            return next(error);
        }
        const token = req.cookies.token;
        if (!token) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            return next(error);
        }
        try {
            //Verify token
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            // declare req body
            const {
                vehicleNumber,
                highlights,
                equipment,
                modification,
                known_flaws,
                make,
                model,
                interiorColor,
                exteriorColor,
                startingBid,
                reservePrice,
            } = req.body;
            // Check for duplicate vehicleNumber
            const existingCar = await prisma.request.findFirst({
                where: {
                    vehicleNumber: vehicleNumber  // Use vehicleNumber from req.body
                },
                select: {
                    vehicleNumber: true  // Select only the vehicleNumber field
                }
            });
            if (existingCar) {
                const error = new Error('A car with this vehicle number already exists');
                error.statusCode = 400;
                return next(error);
            }
            const startingBidFloat = parseFloat(startingBid);
            const reservePriceFloat = parseFloat(reservePrice);
            // process image
            const processedImage = await handleImageProcessing(req.file);
            const request = await prisma.request.create({
                data: {
                    vehicleNumber,
                    carImage: processedImage,
                    highlights,
                    equipment,
                    modifications: modification, // Note: field name is "modifications" not "modification"
                    knownFlaws: known_flaws,
                    make,
                    model,
                    interiorColor,
                    exteriorColor,
                    startingBid: startingBidFloat,
                    reservePrice: reservePriceFloat,
                    account: {
                        connect: {
                            //Find account associated with the token by accountID
                            accountID: payload.accountID,
                        },
                    },
                    requestStatus: "Pending",
                    submissionTime: DateTime.now().setZone('Asia/Singapore').toISO(),
                },
            });
            // const accountID = payload.accountID;
            // const accountLog = createLogWrapper(accountID);
            // accountLog.info(`Request ID: ${JSON.stringify(request.requestID)}. Car listing successfully requested. `);
            req.log.info(`Request ID: ${JSON.stringify(request.requestID)}. Car listing successfully requested. `);
            //Return JSON object
            //Return bidding history
            res.status(200).json({ message: 'Car listing successfully requested. ', request });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token has expired' });
            }
            next(error);  // Pass the error to the next middleware (your centralized error handling middleware)
        }
    });

// Centralized error handling middleware to catch and handle all errors
router.use((err, req, res, next) => {
    // console.error(err.stack);  // Log the stack trace
    const statusCode = err.statusCode || 500;  // Use the error's status code, or default to 500
    const response = {
        message: err.message || 'Something broke!'  // Use the error's message, or a default message
    };
    if (process.env.NODE_ENV === 'development') {
        response.error = err;
    } else {
        response.message = 'An error occurred, please try again later.';  // Generic error message
    }
    req.log.error(`${err.message}, Stack: ${err.stack}`);
    res.status(statusCode).json(response);  // Respond with the status code and error message
});

// Export the router object to be used in other parts of the application
module.exports = router;
