const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
const morgan = require('morgan');
const router = express.Router();
const prisma = new PrismaClient();
const sharp = require('sharp');
const path = require('path');
const sanitizeFilename = require('sanitize-filename');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;


// Set up HTTP security headers
router.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "processed_images/"],
        connectSrc: ["'self'"],
    }
}));

// // Set up logging
// // commenting out cause might eat up too much space
// router.use(morgan('combined'));

// Set up rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
router.use(limiter);

const handleImageProcessing = async (file) => {
    if (!file || !file.originalname) {
        throw new Error('Invalid file object');
    }
    const sanitizedFilename = sanitizeFilename(file.originalname);
    const inputPath = file.path;
    const outputPath = path.join(__dirname, '..', '..', 'processed_car_images', sanitizedFilename);
    // Resize image to width of 800px and compress it
    await sharp(inputPath).resize({ width: 600 }).jpeg({ quality: 80 }).toFile(outputPath);
    const fileBuffer = await fs.readFile(outputPath);
    return fileBuffer;
};

// Set up file upload handling
const upload = multer({
    dest: path.join(__dirname, '..', '..', 'uploads'),
    limits: { fileSize: 1000000 }, // limit file size to 1MB
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    },
});

router.get('/allCar', async (req, res) => {
    const allCars = await prisma.car.findMany();
    res.json(allCars);
});

router.post('/addCar', async (req, res) => {
    const newCar = await prisma.car.create({
        data: req.body,
    });
    res.json(newCar);
});

router.post('/sellCar',
    // upload.array('images', 4), // Middleware for handling file uploads
    upload.single('images'),
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
    ],
    async (req, res) => {
        const token = req.cookies.token;
        // console.log("#################")
        // console.log(req.body);
        if (!token) return res.status(401).json({ error: 'Unauthorized' });
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
            const existingCar = await prisma.car.findFirst({
                where: {
                    vehicleNumber: vehicleNumber,  // Use vehicleNumber from req.body
                },
            });
            // If a car with the same vehicleNumber is found, respond with an error
            if (existingCar) {
                return res.status(400).json({ error: 'A car with this vehicle number already exists' });
            }

            const startingBidFloat = parseFloat(startingBid);
            const reservePriceFloat = parseFloat(reservePrice);
            
            // process image
            const processedImage = await handleImageProcessing(req.file);
            const car = await prisma.car.create({
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
                },
            });
            //Return JSON object
            //Return bidding history
            res.status(200).json({ message: 'Car successfully sold', car });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token has expired' });
            }
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

module.exports = router;