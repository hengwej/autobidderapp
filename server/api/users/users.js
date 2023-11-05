const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { sanitiseObj } = require('../../utils/Validator');
const saltRounds = 10;
const csrfProtection = require('../../utils/CsrfUtils');
const checkJwtToken = require('../../utils/JwtTokens');

/**
 * Adds a new user to the database.
 * @route POST /addUser
 * @middleware csrfProtection - Protects against CSRF attacks.
 * @middleware checkJwtToken - Checks and validates JWT token.
 * @returns {User} 200 - New user details.
 */
router.post('/addUser', csrfProtection, checkJwtToken, async (req, res) => {
    try {
        // TODO: Validate req.body before using it
        const newUser = await prisma.user.create({
            data: req.body,
        });
        req.log.info('New user added to database', { userID: newUser.userID });
        res.json(newUser);
    } catch (error) {
        req.log.error('Error adding new user to database', { error });
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
* Retrieves all users from the database.
* @route GET / getAllUsers
* @middleware csrfProtection - Protects against CSRF attacks.
* @middleware checkJwtToken - Checks and validates JWT token.
* @returns {Array} 200 - An array of all user objects. 
**/
router.get('/getAllUsers', csrfProtection, checkJwtToken, async (req, res) => {
    try {
        const allUsers = await prisma.user.findMany();
        req.log.info('Fetched all users');
        res.json(allUsers);
    } catch (error) {
        req.log.error('Error fetching all users', { error });
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Deletes the user's account and associated user details.
 * @route DELETE /deleteAccount
 * @middleware csrfProtection - Protects against CSRF attacks.
 * @middleware checkJwtToken - Checks and validates JWT token.
 * @returns {SuccessMessageResponse} 200 - Success message.
 * @returns {ErrorResponse} 404 - If account not found.
 */
router.delete('/deleteAccount', csrfProtection, checkJwtToken, async (req, res) => {
    try {
        req.log.info('Attempting to delete account');
        const payload = req.user;
        const accountID = payload.accountID;
        // Retrieve the user's userID associated with the account
        const account = await prisma.account.findUnique({
            where: { accountID },
            include: { user: true },
        });
        if (!account) {
            req.log.warn('Account not found');
            return res.status(404).json({ error: 'Account not found' });
        }
        // Delete the account
        await prisma.account.delete({
            where: { accountID },
        });
        // Delete the user
        await prisma.user.delete({
            where: { userID: account.user.userID },
        });
        req.log.info('Account and associated user deleted successfully');
        // Clear the authentication token cookie to log the user out
        res.clearCookie('token', { path: '/', httpOnly: true, secure: true, sameSite: 'None' });
        res.clearCookie('csrfToken', { path: '/', httpOnly: true, secure: true, sameSite: 'Strict' });
        res.status(200).json({ message: 'Account deleted successfully, user logged out' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        req.log.error('Error deleting account: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Retrieves user details based on the provided userID.
 * @route GET /viewUser/:userID
 * @middleware csrfProtection - Protects against CSRF attacks.
 * @middleware checkJwtToken - Checks and validates JWT token.
 * @param {string} userID - The userID of the user to retrieve.
 * @returns {User} 200 - User details.
 * @returns {ErrorResponse} 400 - If userID is invalid.
 * @returns {ErrorResponse} 404 - If user not found.
 */
router.get('/viewUser/:userID', csrfProtection, checkJwtToken, async (req, res) => {
    try {
        const userID = parseInt(req.params.userID);
        req.log.info('Received request for user ID:', userID);
        if (isNaN(userID)) {
            req.log.warn('Invalid user ID received:', req.params.userID);
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        // Here you can use await since this function is marked as async
        const user = await prisma.user.findUnique({
            where: { userID: userID },
        });
        if (!user) {
            req.log.warn('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
        req.log.info('User details retrieved', { userID });
        res.json(user);
    } catch (error) {
        req.log.error('Error retrieving user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Deletes a user based on the provided userID.
 * @route DELETE /deleteUser/:userID
 * @param {string} userID - The userID of the user to delete.
 * @returns {SuccessMessageResponse} 200 - Success message.
 * @returns {ErrorResponse} 400 - If userID is invalid.
 * @returns {ErrorResponse} 404 - If user not found.
 */
router.delete('/deleteUser/:userID', csrfProtection, checkJwtToken, async (req, res) => {
    try {
        const userID = parseInt(req.params.userID);
        req.log.info('Received request to delete user ID:', userID);
        if (isNaN(userID)) {
            req.log.warn('Invalid user ID received:', req.params.userID);
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        // Use await to delete the user
        const deletedUser = await prisma.user.delete({
            where: { userID: userID },
        });
        if (!deletedUser) {
            req.log.warn('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
        req.log.info('User deleted successfully');
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        req.log.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Retrieves user profile details based on the JWT token.
 * @route POST /getUserProfileDetails
 * @middleware csrfProtection - Protects against CSRF attacks.
 * @middleware checkJwtToken - Checks and validates JWT token.
 * @returns {Object} 200 - User profile details.
 * @returns {ErrorResponse} 404 - If account not found.
 * @returns {ErrorResponse} 401 - If token has expired.
 */
router.post('/getUserProfileDetails', csrfProtection, checkJwtToken, async (req, res) => {
    try {
        const payload = req.user;
        //Find account associated with the token by accountID
        const account = await prisma.account.findUnique({
            where: {
                accountID: payload.accountID,
            },
            include: {
                user: true,
            },
        });
        if (!account) {
            req.log.warn('Account not found');
            return res.status(404).json({ error: 'Account not found' });
        }
        //Remove password from account object
        const { password, ...accountWithoutPassword } = account;
        const { user } = account;
        req.log.info('User profile details retrieved for accountID:', payload.accountID);
        //Return account and user details
        res.json({
            account: accountWithoutPassword,
            user,
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        req.log.error('Error retrieving user profile details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Retrieves user bidding history based on the JWT token.
 * @route POST /getUserBiddingHistory
 * @middleware csrfProtection - Protects against CSRF attacks.
 * @middleware checkJwtToken - Checks and validates JWT token.
 * @returns {Array} 200 - An array of bidding history objects.
 * @returns {ErrorResponse} 401 - If token has expired.
 */
router.post('/getUserBiddingHistory', csrfProtection, checkJwtToken, async (req, res) => {
    try {
        const payload = req.user;
        //Find account associated with the token by accountID
        const biddingHistory = await prisma.biddingHistory.findMany({
            where: {
                accountID: payload.accountID, // Use accountID from token payload
            },
            include: {
                auction: {
                    include: {
                        car: true,
                    },
                },
            },
        });
        //Return bidding history
        req.log.info('Bidding history retrieved for accountID:', payload.accountID);
        res.status(200).json(biddingHistory);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        req.log.error('Error retrieving bidding history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Retrieves user selling history based on the JWT token.
 * @route POST /getUserSellingHistory
 * @middleware csrfProtection - Protects against CSRF attacks.
 * @middleware checkJwtToken - Checks and validates JWT token.
 * @returns {Array} 200 - An array of selling history objects.
 * @returns {ErrorResponse} 401 - If token has expired.
 */
router.post('/getUserSellingHistory', csrfProtection, checkJwtToken, async (req, res) => {
    try {
        const payload = req.user;
        //Find account associated with the token by accountID
        const sellingHistory = await prisma.sellingHistory.findMany({
            where: {
                accountID: payload.accountID, // Use accountID from token payload
            },
            include: {
                order: {
                    include: {
                        account: true,
                        auction: {
                            include: {
                                car: true,
                            }
                        }
                    }
                }
            }
        });
        req.log.info('Selling history retrieved for accountID:', payload.accountID);
        //Return selling history
        res.status(200).json(sellingHistory);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        req.log.error('Error retrieving selling history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Updates user profile details.
 * @route PUT /updateUserProfileDetails
 * @middleware csrfProtection - Protects against CSRF attacks.
 * @middleware checkJwtToken - Checks and validates JWT token.
 * @returns {Object} 200 - Updated user and account details.
 * @returns {ErrorResponse} 404 - If account not found.
 */
router.put('/updateUserProfileDetails', csrfProtection, checkJwtToken, async (req, res) => {
    let { newUserData, newAccountData } = req.body;
    // TODO: Validate newUserData and newAccountData before using them
    newUserData = sanitiseObj(newUserData);
    newAccountData = sanitiseObj(newAccountData);
    try {
        const payload = req.user;
        const accountID = payload.accountID;
        // Find the account associated with the given account ID
        const account = await prisma.account.findUnique({
            where: { accountID },
            include: {
                user: true, // Include the associated user
            },
        });
        if (!account) {
            req.log.warn('Account not found', { accountID });
            return res.status(404).json({ error: 'Account not found' });
        }
        // Update the user data
        const updatedUser = await prisma.user.update({
            where: { userID: account.user.userID },
            data: newUserData,
        });
        // Update the account data
        const updatedAccount = await prisma.account.update({
            where: { accountID },
            data: newAccountData,
        });
        req.log.info('User profile details updated', { userID: updatedUser.userID, accountID: updatedAccount.accountID });
        res.json({ updatedUser, updatedAccount });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        req.log.error('Error updating user profile details', { error });
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});

/**
 * Resets the user's password based on the JWT token.
 * @route PUT /resetPassword
 * @middleware csrfProtection - Protects against CSRF attacks.
 * @middleware checkJwtToken - Checks and validates JWT token.
 * @returns {Object} 200 - Updated account details and success message.
 * @returns {ErrorResponse} 404 - If account not found.
 * @returns {ErrorResponse} 401 - If token has expired.
 */
router.put('/resetPassword', csrfProtection, checkJwtToken, async (req, res) => {
    // Initialize variables
    const { password } = req.body;
    try {
        const payload = req.user;
        const accountID = payload.accountID;
        // Find the account associated with the given account ID
        const account = await prisma.account.findUnique({
            where: { accountID },
        });
        if (!account) {
            req.log.warn('Account not found for accountID:', accountID);
            return res.status(404).json({ error: 'Account not found' });
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Update the account password with the hashed password
        const updatedAccount = await prisma.account.update({
            where: { accountID },
            data: { password: hashedPassword },
        });
        req.log.info('Password reset successfully for accountID:', accountID);
        // Clear the authentication token cookie to log the user out
        res.clearCookie('token', { path: '/', httpOnly: true, secure: true, sameSite: 'None' });
        res.status(200).json({ updatedAccount, message: 'Password updated successfully, user logged out' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        req.log.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});

/**
 * Retrieves user's requests to sell cars based on the JWT token.
 * @route POST /getUserSellCarRequests
 * @middleware csrfProtection - Protects against CSRF attacks.
 * @middleware checkJwtToken - Checks and validates JWT token.
 * @returns {Array} 200 - An array of car sell requests.
 * @returns {ErrorResponse} 401 - If token has expired.
 */
router.post('/getUserSellCarRequests', csrfProtection, checkJwtToken, async (req, res) => {
    try {
        const payload = req.user;
        //Find account associated with the token by accountID
        const carRequests = await prisma.request.findMany({
            where: {
                accountID: payload.accountID, // Use accountID from token payload
            }
        });
        req.log.info('Sell car requests retrieved for accountID:', payload.accountID);
        //Return selling history
        res.status(200).json(carRequests);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        req.log.error('Error retrieving sell car requests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;