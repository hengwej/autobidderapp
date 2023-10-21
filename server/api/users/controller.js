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

