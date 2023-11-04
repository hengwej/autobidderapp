const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


describe('Orders Model Tests', () => {
    let testUser;
    let testAccount;
    let testCar;
    let testAuction;
    let testOrder;

    // Create test data before running the tests
    beforeAll(async () => {
        testUser = await prisma.user.create({
            data: {
                firstName: 'Order',
                lastName: 'Tester',
                phoneNumber: '1234567890',
                emailAddress: 'order.tester@example.com',
            },
        });

        testAccount = await prisma.account.create({
            data: {
                accountType: 'Premium',
                accountStatus: 'Active',
                username: 'order_owner',
                password: 'securepassword', 
                userID: testUser.userID,
            },
        });

        testCar = await prisma.car.create({
            data: {
                vehicleNumber: 'ORD123',
                make: 'OrderMake',
                model: 'OrderModel',
                startingBid: 7000.00,
                reservePrice: 10000.00,
                accountID: testAccount.accountID,
            },
        });

        testAuction = await prisma.auction.create({
            data: {
                auctionStatus: 'Open',
                startDate: new Date(),
                endDate: new Date(new Date().getTime() + (1 * 1 * 1 * 60 * 1000)), // 1 min from now
                currentHighestBid: 0,
                auctionCreationTime: new Date(),
                accountID: testAccount.accountID,
                auctionCreatorID: testAccount.accountID,
                carID: testCar.carID,
            },
        });
    });

    // Clean up test data after all tests
    afterAll(async () => {
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

    test('should create a new order linked to an auction and an account', async () => {
        const orderData = {
            orderStatus: 'Pending',
            auctionID: testAuction.auctionID,
            accountID: testAccount.accountID,
        };

        testOrder = await prisma.orders.create({
            data: orderData,
        });

        expect(testOrder).toMatchObject({
            orderStatus: orderData.orderStatus,
            auctionID: testAuction.auctionID,
            accountID: testAccount.accountID,
        });
    });

    test('should retrieve orders for an auction', async () => {
        const orders = await prisma.orders.findMany({
            where: { auctionID: testAuction.auctionID },
        });

        expect(orders).toBeTruthy();
        expect(orders.length).toBeGreaterThan(0);
        orders.forEach(order => {
            expect(order.auctionID).toBe(testAuction.auctionID);
        });
    });

    test('should update an order’s status', async () => {
        const newStatus = 'Confirmed';

        const updatedOrder = await prisma.orders.update({
            where: { orderID: testOrder.orderID },
            data: { orderStatus: newStatus },
        });

        expect(updatedOrder.orderStatus).toBe(newStatus);
    });

    test('should handle errors when updating a non-existent order', async () => {
        let errorOccurred = false;
    
        try {
            await prisma.orders.update({
                where: { orderID: 99999 }, // Assuming this orderID does not exist
                data: { orderStatus: 'Confirmed' },
            });
        } catch (error) {
            errorOccurred = true;
        }
    
        expect(errorOccurred).toBe(true);
    });

    test('should delete an order', async () => {
        await prisma.orders.delete({
            where: { orderID: testOrder.orderID },
        });

        const deletedOrder = await prisma.orders.findUnique({
            where: { orderID: testOrder.orderID },
        });

        expect(deletedOrder).toBeNull();
    });
    
    test('should delete orders when the related auction is deleted', async () => {
        await prisma.auction.delete({
            where: { auctionID: testAuction.auctionID },
        });
    
        const relatedOrders = await prisma.orders.findMany({
            where: { auctionID: testAuction.auctionID },
        });
    
        expect(relatedOrders.length).toBe(0);
    });
});
