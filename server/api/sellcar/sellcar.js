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
    const sanitizedFilename = sanitizeFilename(file.originalname);
    const inputPath = file.path;
    const outputPath = path.join('processed_images', sanitizedFilename);
    // Resize image to width of 800px and compress it
    await sharp(inputPath).resize({ width: 600 }).jpeg({ quality: 80 }).toFile(outputPath);
    return outputPath;
};

// Set up file upload handling
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 1000000 }, // limit file size to 1MB
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    },
});

router.post('/sellcar',
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
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
                    startingBid,
                    reservePrice,
                },
            });
            res.json(car);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
);

// Error Handling Middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = router;
