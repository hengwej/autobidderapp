const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Endpoint to add a new account.
 * This endpoint receives account data from the request body and attempts to create a new account in the database.
 * If successful, it returns the created account details; otherwise, it sends an error response.
 * 
 * @route POST /addAccount
 * @param {Object} req - Express request object containing account details in the body.
 * @param {Object} res - Express response object used to send the response.
 */
router.post('/addAccount', async (req, res) => {
    try {
        const newAccount = await prisma.account.create({
            data: req.body,
        });
        req.log.info(`Account with ID: ${newAccount.accountID} is successfully added`);  // Logging the successful account creation
        res.json(newAccount);  // Responding with the created account object
    } catch (error) {
        req.log.error(`Error adding new account: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Endpoint to retrieve all accounts.
 * This endpoint fetches all accounts from the database and returns them in an array.
 * If successful, it returns the list of all accounts; otherwise, it sends an error response.
 * 
 * @route POST /allAccount
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object used to send the response.
 */
router.post('/allAccount', async (req, res) => {
    try {
        const allAccounts = await prisma.account.findMany();
        req.log.info(`All accounts have been accessed`);  // Logging the successful account retrieval
        res.json(allAccounts);  // Responding with the array of all accounts
    } catch (error) {
        req.log.error(`Error fetching all accounts: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
