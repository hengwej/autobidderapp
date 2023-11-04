const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('BiddingHistory Model Tests', () => {
    let testUser;
    let testAccount;
    let testCar;
    let testAuction;
    let testBiddingHistory;

    // Create test data before running the tests
    beforeAll(async () => {
        testUser = await prisma.user.create({
            data: {
                firstName: 'Bidder',
                lastName: 'HistoryTester',
                phoneNumber: '1234567890',
                emailAddress: 'bidder.historytester@example.com',
            },
        });

        testAccount = await prisma.account.create({
            data: {
                accountType: 'Bidder',
                accountStatus: 'Active',
                username: 'bidder_history',
                password: 'securepassword',
                userID: testUser.userID,
            },
        });

        testCar = await prisma.car.create({
            data: {
                vehicleNumber: 'BID123',
                make: 'BidMake',
                model: 'BidModel',
                startingBid: 8000.00,
                reservePrice: 12000.00,
                accountID: testAccount.accountID,
            },
        });

        testAuction = await prisma.auction.create({
            data: {
                auctionStatus: 'Open',
                startDate: new Date(),
                endDate: new Date(new Date().getTime() + (1 * 1 * 1 * 60 * 1000)), // 1 min from now
                currentHighestBid: 8000.00,
                auctionCreationTime: new Date(),
                accountID: testAccount.accountID,
                auctionCreatorID: testAccount.accountID,
                carID: testCar.carID,
            },
        });
    });

    // Clean up test data after all tests
    afterAll(async () => {
        await prisma.biddingHistory.deleteMany({
            where: { accountID: testAccount.accountID },
        });

        await prisma.auction.deleteMany({
            where: { carID: testCar.carID },
        });

        await prisma.car.deleteMany({
            where: { accountID: testAccount.accountID },
        });

        await prisma.account.deleteMany({
            where: { userID: testUser.userID },
        });

        await prisma.user.deleteMany({
            where: { userID: testUser.userID },
        });
    });

    test('should create a new bidding history record linked to an auction and an account', async () => {
        const biddingHistoryData = {
            bidAmount: 8500.00,
            bidTimestamp: new Date(),
            bidStatus: 'Placed',
            accountID: testAccount.accountID,
            auctionID: testAuction.auctionID,
        };

        testBiddingHistory = await prisma.biddingHistory.create({
            data: biddingHistoryData,
        });

        expect(testBiddingHistory).toMatchObject({
            bidAmount: biddingHistoryData.bidAmount,
            bidStatus: biddingHistoryData.bidStatus,
            accountID: testAccount.accountID,
            auctionID: testAuction.auctionID,
        });
    });

    test('should retrieve bidding history for an auction', async () => {
        const histories = await prisma.biddingHistory.findMany({
            where: { auctionID: testAuction.auctionID },
        });

        expect(histories).toBeTruthy();
        expect(histories.length).toBeGreaterThan(0);
        histories.forEach(history => {
            expect(history.auctionID).toBe(testAuction.auctionID);
        });
    });

    test('should update a bid’s amount', async () => {
        const newBidAmount = 9000.00;

        const updatedBiddingHistory = await prisma.biddingHistory.update({
            where: { bidID: testBiddingHistory.bidID },
            data: { bidAmount: newBidAmount },
        });

        expect(updatedBiddingHistory.bidAmount).toBe(newBidAmount);
    });

    // Relationship tests
    test('should create a bidding history and fetch the associated auction and account', async () => {
        const createdBiddingHistory = await prisma.biddingHistory.create({
            data: {
                bidAmount: 8600.00,
                bidTimestamp: new Date(),
                bidStatus: 'Placed',
                accountID: testAccount.accountID,
                auctionID: testAuction.auctionID,
            },
            include: {
                account: true,
                auction: true,
            }
        });

        expect(createdBiddingHistory.account).toBeDefined();
        expect(createdBiddingHistory.auction).toBeDefined();
        expect(createdBiddingHistory.account.userID).toBe(testUser.userID);
        expect(createdBiddingHistory.auction.carID).toBe(testCar.carID);
    });

    test('should delete a bidding history record', async () => {
        await prisma.biddingHistory.delete({
            where: { bidID: testBiddingHistory.bidID },
        });

        const deletedHistory = await prisma.biddingHistory.findUnique({
            where: { bidID: testBiddingHistory.bidID },
        });

        expect(deletedHistory).toBeNull();
    });
});
