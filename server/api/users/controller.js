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

