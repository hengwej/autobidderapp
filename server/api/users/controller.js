const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.addUser = async (req, res) => {
    const newUser = await prisma.user.create({
        data: req.body,
    });
    res.json(newUser);
};
exports.getAllUsers = async (req, res) => {
    const allUsers = await prisma.user.findMany();
    res.json(allUsers);
};


exports.deleteUser = async (req, res) => {
    const userID = parseInt(req.params.id);
    console.log("Received DELETE request for user ID:", userID);

    try {
        await prisma.user.delete({
            where: { userID: userID }, // Use "userID" instead of "id"
        });
        console.log("User deleted successfully");
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Define an async function for your controller
exports.viewUser = async (req, res) => {
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
};

exports.getUserProfileDetails = async (req, res) => {
    const accountID = req.params.id; // Use req.params.id to get the account ID from the URL

    try {
        const account = await prisma.account.findUnique({
            where: { accountID: parseInt(accountID) }, // Parse to an integer
            include: {
                user: true, // Include the associated user details
            },
        });

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const user = account.user;
        res.json(user);
    } catch (error) {
        console.error("Error getting user details:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserBiddingHistory = async (req, res) => {
    const accountID = req.params.id; // Use req.params.id to get the account ID from the URL

    try {
        const biddingHistory = await prisma.biddingHistory.findMany({
            where: { accountID: parseInt(accountID) }, // Filter by the accountID
        });

        res.json(biddingHistory);
    } catch (error) {
        console.error("Error getting user's bidding history:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserSellingHistory = async (req, res) => {
    const accountID = req.params.id; // Use req.params.id to get the account ID from the URL

    try {
        const sellingHistory = await prisma.sellingHistory.findMany({
            where: { accountID: parseInt(accountID) }, // Filter by the accountID
            include: {
                order: true // Include all fields from the associated Orders table
            }
        });

        res.json(sellingHistory);
    } catch (error) {
        console.error("Error getting user's selling history:", error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};

exports.updateUserProfileDetails = async (req, res) => {
    const accountID = parseInt(req.params.id); // Use req.params.id to get the account ID from the URL
    const { newUserData, newAccountData } = req.body; // You can pass the updated data in the request body

    try {
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
        
        const updatedUser = await prisma.user.update({
            where: { userID: account.user.userID },
            data: newUserData, // An object containing the updated user data
        });

        // Update the account data
        const updatedAccount = await prisma.account.update({
            where: { accountID },
            data: newAccountData, // An object containing the updated account data
        });

        res.json({ updatedUser, updatedAccount });
    } catch (error) {
        console.error("Error updating user and account data:", error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
};