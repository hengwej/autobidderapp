const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.getAllRequests = async (req, res) => {
    const allRequests = await prisma.request.findMany();
    res.json(allRequests);
};


exports.viewRequestDetails = async (req, res) => {
    try {
        const requestID = parseInt(req.params.requestID);
        console.log("Received request for user ID:", requestID);

        if (isNaN(requestID)) {
            console.log("Invalid request ID received:", req.params.id);
            return res.status(400).json({ error: 'Invalid request ID' });
        }

        // Here you can use await since this function is marked as async
        const user = await prisma.request.findUnique({
            where: { requestID: requestID },
        });

        if (!user) {
            return res.status(404).json({ error: 'request not found' });
        }

        res.json(user);
    } catch (error) {
        console.error("Error retrieving request details:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};