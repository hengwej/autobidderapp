const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

/**
 * @description Endpoint to fetch all FAQs from the database.
 * This route retrieves all the Frequently Asked Questions (FAQs) stored in the database 
 * and returns them as a JSON array.
 * 
 * @route GET /getAllFAQs
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/getAllFAQs', async (req, res) => {
    try {
        req.log.info("Fetching all FAQs");  // Logging the start of the operation
        const allFAQs = await prisma.fAQ.findMany();
        res.json(allFAQs);  // Sending the retrieved FAQs as a JSON response
    } catch (error) {
        req.log.error(`Error fetching FAQs: ${error.message}`);  // Logging in case of an error
        res.status(500).json({ error: 'Failed to fetch FAQs. Please try again later.' });  // Sending a more descriptive error message
    }
});

module.exports = router;
