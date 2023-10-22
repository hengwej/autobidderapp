const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const router = express.Router();
const prisma = new PrismaClient();



router.post('/addUser', async (req, res) => {
    const newUser = await prisma.user.create({
        data: req.body,
    });
    res.json(newUser);
});

router.get('/getAllUsers', async (req, res) => {
    const allUsers = await prisma.user.findMany();
    res.json(allUsers);
});

router.delete('/deleteAccount', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const payload = jwt.verify(token, 'your-secret-key');
        const accountID = payload.accountID;

        // Delete the account (and the associated user due to cascading)
        await prisma.account.delete({
            where: { accountID },
        });

        console.log("Account and associated user deleted successfully");

        // Clear the authentication token cookie to log the user out
        res.clearCookie('token');

        res.json({ message: 'Account deleted successfully, user logged out' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }

        console.error("Error deleting account:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/viewUser/:userID', async (req, res) => {
    try {
        const userID = parseInt(req.params.userID);
        console.log("Received request for user ID:", userID);

        if (isNaN(userID)) {
            console.log("Invalid user ID received:", req.params.id);
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Here you can use await since this function is marked as async
        const user = await prisma.user.findUnique({
            where: { userID: userID },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error("Error retrieving user details:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/getUserProfileDetails', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        //Verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET);

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
            return res.status(404).json({ error: 'Account not found' });
        }

        //Remove password from account object
        const { password, ...accountWithoutPassword } = account;
        const { user } = account;

        //Return account and user details
        res.json({
            account: accountWithoutPassword,
            user,
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }

        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/getUserBiddingHistory', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        //Verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET);

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
        res.json(biddingHistory);

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }

        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/getUserBiddingHistory', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        //Verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        //Find account associated with the token by accountID
        const sellingHistory = await prisma.sellingHistory.findMany({
            where: {
                accountID: payload.accountID, // Use accountID from token payload
            },
            include: {
                account: true,
                order: {
                    include: {
                        auction: {
                            include: {
                                car: true,
                            }
                        }
                    }
                }
            }
        });

        //Return selling history
        res.json(sellingHistory);

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }

        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.put('/updateUserProfileDetails', async (req, res) => {
    const { newUserData, newAccountData } = req.body;
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Verify the token and extract the account ID
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const accountID = payload.accountID;

        // Find the account associated with the given account ID
        const account = await prisma.account.findUnique({
            where: { accountID },
            include: {
                user: true, // Include the associated user
            },
        });

        if (!account) {
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

        res.json({ updatedUser, updatedAccount });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }

        console.error("Error updating user and account data:", error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});


module.exports = router;