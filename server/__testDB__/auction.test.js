const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Auction Model Tests', () => {
    let testUser;
    let testAccount;
    let testCar;

    // Create test data before running the tests
    beforeAll(async () => {
        testUser = await prisma.user.create({
            data: {
                firstName: 'Auction',
                lastName: 'Tester',
                phoneNumber: '1234567890',
                emailAddress: 'auction.tester@example.com',
            },
        });

        testAccount = await prisma.account.create({
            data: {
                accountType: 'Premium',
                accountStatus: 'Active',
                username: 'auction_owner',
                password: 'securepassword',
                userID: testUser.userID,
            },
        });

        testCar = await prisma.car.create({
            data: {
                vehicleNumber: 'AUC123',
                make: 'TestMake',
                model: 'TestModel',
                startingBid: 5000.00,
                reservePrice: 7500.00,
                accountID: testAccount.accountID,
            },
        });
    });

    // Clean up test data after all tests
    afterAll(async () => {
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

    test('should create a new auction linked to a car and an account', async () => {
        const auctionData = {
            auctionStatus: 'Open',
            startDate: new Date(),
            endDate: new Date(new Date().getTime() + (1 * 1 * 1 * 60 * 1000)), // 1 min from now
            currentHighestBid: 0,
            auctionCreationTime: new Date(),
            accountID: testAccount.accountID,
            auctionCreatorID: testAccount.accountID,
            carID: testCar.carID,
        };

        const auction = await prisma.auction.create({
            data: auctionData,
        });

        expect(auction).toMatchObject({
            auctionStatus: auctionData.auctionStatus,
            currentHighestBid: auctionData.currentHighestBid,
        });

        // Ensure the auction is linked to the car and account
        expect(auction.carID).toBe(testCar.carID);
        expect(auction.auctionCreatorID).toBe(testAccount.accountID);
    });

    test('should retrieve an auction by auction status', async () => {
        const status = 'Open';
        const auctions = await prisma.auction.findMany({
            where: { auctionStatus: status },
        });

        expect(auctions).toBeTruthy();
        expect(auctions.length).toBeGreaterThan(0);
        expect(auctions[0].auctionStatus).toBe(status);
    });

    test('should update an auction’s current highest bid', async () => {
        const newHighestBid = 10000.00;
        const auction = await prisma.auction.findFirst({
            where: { carID: testCar.carID },
        });

        const updatedAuction = await prisma.auction.update({
            where: { auctionID: auction.auctionID },
            data: { currentHighestBid: newHighestBid },
        });

        expect(updatedAuction.currentHighestBid).toBe(newHighestBid);
    });

    // Validation test: trying to create an auction with invalid data
    test('should not create an auction with invalid data', async () => {
        await expect(
            prisma.auction.create({
                data: {
                    // auctionStatus should not be null
                    auctionStatus: null,
                    startDate: new Date(),
                    endDate: new Date(new Date().getTime() + (1 * 1 * 1 * 60 * 1000)),
                    currentHighestBid: -1, // currentHighestBid should not be negative
                    auctionCreationTime: new Date(),
                    accountID: testAccount.accountID,
                    auctionCreatorID: testAccount.accountID,
                    carID: testCar.carID,
                },
            })
        ).rejects.toThrow();
    });

    // Relationship test: creating an auction and fetching the associated car and account
    test('should create an auction and fetch associated car and account', async () => {
        const auctionData = {
            auctionStatus: 'Open',
            startDate: new Date(),
            endDate: new Date(new Date().getTime() + (1 * 1 * 1 * 60 * 1000)), // 1 min from now
            currentHighestBid: 5000.00,
            auctionCreationTime: new Date(),
            accountID: testAccount.accountID,
            auctionCreatorID: testAccount.accountID,
            carID: testCar.carID,
        };

        const auction = await prisma.auction.create({
            data: auctionData,
        });

        const fetchedAuction = await prisma.auction.findUnique({
            where: { auctionID: auction.auctionID },
            include: {
                account: true, // Include the account
                car: true, // Include the car
            },
        });

        expect(fetchedAuction).toBeTruthy();
        expect(fetchedAuction.account).toBeTruthy();
        expect(fetchedAuction.car).toBeTruthy();
        expect(fetchedAuction.account.accountID).toBe(testAccount.accountID);
        expect(fetchedAuction.car.carID).toBe(testCar.carID);
    });

    // Error handling test: handling constraints and validations
    test('should create an auction even with past end date', async () => {
        const auctionData = {
            auctionStatus: 'Open',
            startDate: new Date(),
            endDate: new Date(new Date().getTime() - (1 * 1 * 1 * 60 * 1000)), // 1 min in the past
            currentHighestBid: 5000.00,
            auctionCreationTime: new Date(),
            accountID: testAccount.accountID,
            auctionCreatorID: testAccount.accountID,
            carID: testCar.carID,
        };

        const auction = await prisma.auction.create({
            data: auctionData,
        });

        expect(auction).toBeTruthy();
        expect(auction.auctionStatus).toBe('Open');
        expect(auction.endDate.getTime()).toBeLessThan(new Date().getTime());
    });

    test('should delete an auction', async () => {
        const auction = await prisma.auction.findFirst({
            where: { carID: testCar.carID },
        });

        await prisma.auction.delete({
            where: { auctionID: auction.auctionID },
        });

        const deletedAuction = await prisma.auction.findUnique({
            where: { auctionID: auction.auctionID },
        });

        expect(deletedAuction).toBeNull();
    });
});
