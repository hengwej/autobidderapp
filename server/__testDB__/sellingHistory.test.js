const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


describe('SellingHistory Model Tests', () => {
    let testUser;
    let testAccount;
    let testCar;
    let testAuction;
    let testOrder;
    let testSellingHistory;

    // Create test data before running the tests
    beforeAll(async () => {
        testUser = await prisma.user.create({
            data: {
                firstName: 'Seller',
                lastName: 'HistoryTester',
                phoneNumber: '1234567890',
                emailAddress: 'seller.historytester@example.com',
            },
        });

        testAccount = await prisma.account.create({
            data: {
                accountType: 'Seller',
                accountStatus: 'Active',
                username: 'seller_history',
                password: 'securepassword',
                userID: testUser.userID,
            },
        });

        testCar = await prisma.car.create({
            data: {
                vehicleNumber: 'SELL123',
                make: 'SellingMake',
                model: 'SellingModel',
                startingBid: 10000.00,
                reservePrice: 15000.00,
                accountID: testAccount.accountID,
            },
        });

        testAuction = await prisma.auction.create({
            data: {
                auctionStatus: 'Closed',
                startDate: new Date(),
                endDate: new Date(),
                currentHighestBid: 15000.00,
                auctionCreationTime: new Date(),
                accountID: testAccount.accountID,
                auctionCreatorID: testAccount.accountID,
                carID: testCar.carID,
            },
        });

        testOrder = await prisma.orders.create({
            data: {
                orderStatus: 'Completed',
                auctionID: testAuction.auctionID,
                accountID: testAccount.accountID,
            },
        });
    });

    // Clean up test data after all tests
    afterAll(async () => {
        await prisma.sellingHistory.deleteMany({
            where: { accountID: testAccount.accountID },
        });

        await prisma.orders.deleteMany({
            where: { auctionID: testAuction.auctionID },
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

    test('should create a new selling history record linked to an order and an account', async () => {
        const sellingHistoryData = {
            orderID: testOrder.orderID,
            accountID: testAccount.accountID,
        };

        testSellingHistory = await prisma.sellingHistory.create({
            data: sellingHistoryData,
        });

        expect(testSellingHistory).toMatchObject({
            orderID: testOrder.orderID,
            accountID: testAccount.accountID,
        });
    });

    test('should retrieve selling history for an account', async () => {
        const histories = await prisma.sellingHistory.findMany({
            where: { accountID: testAccount.accountID },
        });

        expect(histories).toBeTruthy();
        expect(histories.length).toBeGreaterThan(0);
        histories.forEach(history => {
            expect(history.accountID).toBe(testAccount.accountID);
        });
    });

    // Test for trying to create a selling history with invalid data
    test('should not create a selling history with invalid data', async () => {
        await expect(prisma.sellingHistory.create({
            data: {
                orderID: 0, // Assuming 0 is not a valid orderID
                accountID: testAccount.accountID,
            },
        })).rejects.toThrow();
    });

    // Test for creating a selling history and fetching the associated order and account
    test('should create a selling history and fetch associated order and account', async () => {
        const newSellingHistory = await prisma.sellingHistory.create({
            data: {
                orderID: testOrder.orderID,
                accountID: testAccount.accountID,
            },
            include: {
                order: true,
                account: true,
            },
        });

        expect(newSellingHistory.order).toBeTruthy();
        expect(newSellingHistory.account).toBeTruthy();
        expect(newSellingHistory.order.orderID).toBe(testOrder.orderID);
        expect(newSellingHistory.account.accountID).toBe(testAccount.accountID);
    });

    test('should delete a selling history record', async () => {
        await prisma.sellingHistory.delete({
            where: { saleID: testSellingHistory.saleID },
        });

        const deletedHistory = await prisma.sellingHistory.findUnique({
            where: { saleID: testSellingHistory.saleID },
        });

        expect(deletedHistory).toBeNull();
    });
});
