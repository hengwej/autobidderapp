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


// Create a new controller function for deleting a request
exports.deleteRequest = async (req, res) => {
    try {
        const requestID = parseInt(req.params.requestID);

        if (isNaN(requestID)) {
            return res.status(400).json({ error: 'Invalid request ID' });
        }

        // Check if the request exists before deletion
        const existingRequest = await prisma.request.findUnique({
            where: { requestID: requestID },
        });

        if (!existingRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Perform the deletion of the request
        await prisma.request.delete({
            where: { requestID: requestID },
        });

        // Return a success message
        res.json({ message: 'Request deleted successfully' });
    } catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};