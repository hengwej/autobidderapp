const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const csrfProtection = require('../../utils/CsrfUtils');
const checkJwtToken = require('../../utils/JwtTokens');
// Set to keep track of processed requests to prevent double processing
const processedRequests = new Set();

/**
 * Helper function to validate request ID.
 * @param {string} requestID - The request ID to validate.
 * @returns {number|null} - Returns parsed request ID or null if invalid.
 */
function validateRequestID(requestID) {
    const parsedID = parseInt(requestID);
    return isNaN(parsedID) ? null : parsedID;
}

/**
 * Endpoint to fetch all requests from the database.
 * @route GET /getAllRequests
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/getAllRequests', csrfProtection, checkJwtToken, async (req, res) => {
    try {
        req.log.info("Fetching all requests");  // Logging the start of the operation
        const allRequests = await prisma.request.findMany();
        req.log.info("Successfully Fetched all requests");  // Logging the end of the operation
        res.json(allRequests);
    } catch (error) {
        req.log.error(`Error fetching all requests: ${error.message}`);  // Logging in case of an error
        res.status(500).send("Internal server error");
    }
});

/**
 * Endpoint to view details of a specific request.
 * @route GET /viewRequestDetails/:requestID
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get('/viewRequestDetails/:requestID', csrfProtection, checkJwtToken, async (req, res) => {
    const requestID = validateRequestID(req.params.requestID);
    if (!requestID) {
        req.log.warn(`Invalid request ID received: ${req.params.requestID}`);
        return res.status(400).json({ error: 'Invalid request ID' });
    }
    try {
        req.log.info(`Fetching details for request ID: ${requestID}`);
        const requestDetails = await prisma.request.findUnique({
            where: { requestID: requestID },
        });
        if (!requestDetails) {
            req.log.warn(`Request not found for ID: ${requestID}`);
            return res.status(404).json({ error: 'Request not found' });
        }
        req.log.info(`Successfully retrieved details for request ID: ${requestID}`);
        res.json(requestDetails);
    } catch (error) {
        req.log.error(`Error retrieving request details for ID ${requestID}: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Endpoint to reject a specific request.
 * @route DELETE /rejectRequest/:requestID
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.delete('/rejectRequest/:requestID', csrfProtection, checkJwtToken, async (req, res) => {
    const requestID = validateRequestID(req.params.requestID);
    if (!requestID) {
        req.log.warn(`Invalid request ID provided for rejection: ${requestID}`);
        return res.status(400).json({ error: 'Invalid request ID' });
    }
    try {
        if (processedRequests.has(requestID)) {
            req.log.warn(`Attempt to process already processed request ID: ${requestID}`);
            return res.status(400).json({ error: 'Request has already been processed' });
        }
        const existingRequest = await prisma.request.findUnique({
            where: { requestID: requestID },
        });
        if (!existingRequest) {
            req.log.warn(`Request not found for rejection with ID: ${requestID}`);
            return res.status(404).json({ error: 'Request not found' });
        }
        await prisma.request.update({
            where: { requestID: requestID },
            data: { requestStatus: 'Rejected' },
        });
        processedRequests.add(requestID);
        req.log.info(`Request with ID ${requestID} rejected successfully`);
        res.json({ message: 'Request rejected successfully' });
    } catch (error) {
        req.log.error(`Error rejecting request with ID ${requestID}: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Endpoint to approve a specific request.
 * @route POST /approveRequest/:requestID
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/approveRequest/:requestID', csrfProtection, checkJwtToken, async (req, res) => {
    try {
        req.log.info(`Attempting to approve request with ID: ${req.params.requestID}`);  // Logging the start of approval
        // Verify token
        const token = req.cookies.token;
        if (!token) {
            req.log.warn('Unauthorized attempt to approve request');  // Logging unauthorized attempt
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const payload = req.user;
        const hardcodedAccountID = payload.accountID;
        const requestID = validateRequestID(req.params.requestID);
        if (!requestID) {
            req.log.warn(`Invalid request ID provided for approval: ${requestID}`);  // Logging when invalid ID is provided
            return res.status(400).json({ error: 'Invalid request ID' });
        }
        // Check if the request has already been processed
        if (processedRequests.has(requestID)) {
            req.log.warn(`Attempt to process already processed request ID: ${requestID}`);  // Logging when request is already processed
            return res.status(400).json({ error: 'Request has already been processed' });
        }
        // Check if the request exists before approval
        const existingRequest = await prisma.request.findUnique({
            where: { requestID: requestID },
        });
        if (!existingRequest) {
            req.log.warn(`Request not found for approval with ID: ${requestID}`);  // Logging when request is not found
            return res.status(404).json({ error: 'Request not found' });
        }
        // Calculate endDate as 1 week (7 days) later from the startDate
        const startDate = new Date(); // Set the start date to the current timestamp
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7); // Add 7 days to the start date to get the end date
        const accountID = existingRequest.accountID; // Fetch accountID from existingRequest
        // Create a new car record in the car table using the request data
        const newCar = await prisma.car.create({
            data: {
                vehicleNumber: existingRequest.vehicleNumber,
                carImage: existingRequest.carImage,
                highlights: existingRequest.highlights,
                equipment: existingRequest.equipment,
                modifications: existingRequest.modifications,
                knownFlaws: existingRequest.knownFlaws,
                make: existingRequest.make,
                model: existingRequest.model,
                interiorColor: existingRequest.interiorColor,
                exteriorColor: existingRequest.exteriorColor,
                startingBid: existingRequest.startingBid,
                reservePrice: existingRequest.reservePrice,
                accountID: existingRequest.accountID,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        const newAuction = await prisma.auction.createMany({
            data: {
                auctionStatus: 'OPENED',
                startDate: startDate,
                endDate: endDate,
                currentHighestBid: existingRequest.startingBid,
                auctionCreationTime: new Date(),
                accountID: accountID,
                auctionCreatorID: hardcodedAccountID,
                carID: newCar.carID,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        // Mark the request as processed
        processedRequests.add(requestID);
        await prisma.request.delete({
            where: { requestID: requestID },
        });
        req.log.info(`Request with ID ${requestID} approved successfully and car added to the car table`);  // Logging successful approval
        res.json({ message: 'Request approved, car added to the car table, and auction opened' });
    } catch (error) {
        req.log.error(`Error approving request with ID ${requestID}: ${error.message}`);  // Logging in case of an error
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;