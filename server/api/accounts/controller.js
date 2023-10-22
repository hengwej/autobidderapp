const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.addAccount = async (req, res) => {
    const newAccount = await prisma.account.create({
        data: req.body,
    });
    res.json(newAccount);
};

exports.allAccount = async (req, res) => {
    const allAccounts = await prisma.account.findMany();
    res.json(allAccounts);
};

exports.getUserAccountDetails = async (req, res) => {
    const accountID = req.params.id; // Use req.params.id to get the account ID from the URL

    try {
        const account = await prisma.account.findUnique({
            where: { accountID: parseInt(accountID) }, // Parse to an integer
        });

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.json(account);
    } catch (error) {
        console.error("Error getting account details:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteAccount = async (req, res) => {
    const accountID = req.params.id; // Use req.params.id to get the account ID from the URL

    try {
        // Check if the account exists
        const account = await prisma.account.findUnique({
            where: { accountID: parseInt(accountID) }, // Parse to an integer
            include: {
                user: true, // Include the associated user
            },
        });

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        // Delete the user (if it exists), and the account will be deleted automatically due to the cascade delete relationship
        if (account.user) {
            await prisma.user.delete({
                where: { userID: account.user.userID },
            });
        }

        res.json({ message: 'Account and associated user deleted successfully' });
    } catch (error) {
        console.error("Error deleting account and user:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};