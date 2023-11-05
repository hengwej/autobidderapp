const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Request Model Tests', () => {
    let testUser;
    let testAccount;
    let testRequest;

    // Create test data before running the tests
    beforeAll(async () => {
        testUser = await prisma.user.create({
            data: {
                firstName: 'Requester',
                lastName: 'Doe',
                phoneNumber: '1234567890',
                emailAddress: 'requester.doe@example.com',
            },
        });

        testAccount = await prisma.account.create({
            data: {
                accountType: 'Regular',
                accountStatus: 'Active',
                username: 'requester_doe',
                password: 'securepassword', // Remember to hash in production
                userID: testUser.userID,
            },
        });
    });

    // Clean up test data after all tests
    afterAll(async () => {
        await prisma.request.deleteMany({
            where: { accountID: testAccount.accountID },
        });

        await prisma.account.deleteMany({
            where: { userID: testUser.userID },
        });

        await prisma.user.deleteMany({
            where: { userID: testUser.userID },
        });
    });

    test('should create a new request linked to an account', async () => {
        const carImageBuffer = Buffer.from('Test image data'); // Example dummy image data

        const requestData = {
            requestStatus: 'Pending',
            submissionTime: new Date(),
            vehicleNumber: 'REQ123',
            make: 'RequestMake',
            model: 'RequestModel',
            startingBid: 5000.00,
            reservePrice: 7500.00,
            carImage: carImageBuffer,
            accountID: testAccount.accountID,
        };

        testRequest = await prisma.request.create({
            data: requestData,
        });

        expect(testRequest).toMatchObject({
            requestStatus: requestData.requestStatus,
            vehicleNumber: requestData.vehicleNumber,
            accountID: testAccount.accountID,
        });
    });

    test('should retrieve requests for an account', async () => {
        const requests = await prisma.request.findMany({
            where: { accountID: testAccount.accountID },
        });

        expect(requests).toBeTruthy();
        expect(requests.length).toBeGreaterThan(0);
        requests.forEach(request => {
            expect(request.accountID).toBe(testAccount.accountID);
        });
    });

    test('should update a request’s status', async () => {
        const newStatus = 'Approved';

        const updatedRequest = await prisma.request.update({
            where: { requestID: testRequest.requestID },
            data: { requestStatus: newStatus },
        });

        expect(updatedRequest.requestStatus).toBe(newStatus);
    });

    test('should not create a request with invalid data', async () => {
        expect(async () => {
            await prisma.request.create({
                data: {
                    // This should fail due to missing required fields like `vehicleNumber`
                    requestStatus: 'Pending',
                    submissionTime: new Date(),
                    make: 'RequestMake',
                    model: 'RequestModel',
                    startingBid: 5000.00,
                    reservePrice: 7500.00,
                    accountID: testAccount.accountID,
                },
            });
        }).rejects.toThrow();
    });

    test('should not create a request with invalid accountID', async () => {
        expect(async () => {
            await prisma.request.create({
                data: {
                    requestStatus: 'Pending',
                    submissionTime: new Date(),
                    vehicleNumber: 'REQ123',
                    make: 'RequestMake',
                    model: 'RequestModel',
                    startingBid: 5000.00,
                    reservePrice: 7500.00,
                    // Using an accountID that does not exist should cause a failure
                    accountID: -1,
                },
            });
        }).rejects.toThrow();
    });

    test('should fetch the associated account with a request', async () => {
        const requestWithAccount = await prisma.request.findUnique({
            where: { requestID: testRequest.requestID },
            include: { account: true },
        });
        expect(requestWithAccount).toBeTruthy();
        expect(requestWithAccount.account).toBeTruthy();
        expect(requestWithAccount.account.userID).toBe(testUser.userID);
    });

    test('should delete a request', async () => {
        await prisma.request.delete({
            where: { requestID: testRequest.requestID },
        });

        const deletedRequest = await prisma.request.findUnique({
            where: { requestID: testRequest.requestID },
        });

        expect(deletedRequest).toBeNull();
    });
});
