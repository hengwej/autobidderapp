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


exports.rejectRequest = async (req, res) => {
    try {
        const requestID = parseInt(req.params.requestID);

        if (isNaN(requestID)) {
            return res.status(400).json({ error: 'Invalid request ID' });
        }

        // Check if the request has already been processed
        if (processedRequests.has(requestID)) {
            return res.status(400).json({ error: 'Request has already been processed' });
        }

        // Check if the request exists before rejection
        const existingRequest = await prisma.request.findUnique({
            where: { requestID: requestID },
        });

        if (!existingRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Update the request status to 'rejected'
        await prisma.request.update({
            where: { requestID: requestID },
            data: {
                requestStatus: 'Rejected',
            },
        });

        // Mark the request as processed
        processedRequests.add(requestID);

        res.json({ message: 'Request rejected successfully' });
    } catch (error) {
        console.error('Error rejecting request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const processedRequests = new Set();

// New controller function for approving a request
exports.approveRequest = async (req, res) => {
    try {
        const requestID = parseInt(req.params.requestID);

        if (isNaN(requestID)) {
            return res.status(400).json({ error: 'Invalid request ID' });
        }

        // Check if the request has already been processed
        if (processedRequests.has(requestID)) {
            return res.status(400).json({ error: 'Request has already been processed' });
        }

        // Check if the request exists before approval
        const existingRequest = await prisma.request.findUnique({
            where: { requestID: requestID },
        });

        if (!existingRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Calculate endDate as 1 week (7 days) later from the startDate
        const startDate = new Date(); // Set the start date to the current timestamp
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7); // Add 7 days to the start date to get the end date
        console.log('existingRequest:', existingRequest);
        console.log('req.user:', req.user);
        const accountID = existingRequest.accountID; // Fetch accountID from existingRequest

        const hardcodedAccountID = 25;

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
                accountID:accountID ,
                auctionCreatorID: hardcodedAccountID , 
                carID: newCar.carID ,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        // Mark the request as processed
        processedRequests.add(requestID);

        await prisma.request.delete({
            where: { requestID: requestID },
        });

        res.json({ message: 'Request approved, car added to the car table, and auction opened' });
    } catch (error) {
        console.error('Error approving request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};