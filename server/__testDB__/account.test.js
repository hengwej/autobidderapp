const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


describe('Account Model Tests', () => {
    let testUser;

    // Create a test user to associate with accounts before all tests
    beforeAll(async () => {
        testUser = await prisma.user.create({
            data: {
                firstName: 'Jane',
                lastName: 'Doe',
                phoneNumber: '0987654321',
                emailAddress: 'jane.doe@example.com',
            },
        });
    });

    // // Clean up test data after all tests
    // afterAll(async () => {
    //     await prisma.account.deleteMany({
    //         where: {
    //             user: {
    //                 emailAddress: 'jane.doe@example.com',
    //             },
    //         },
    //     });

    //     await prisma.user.deleteMany({
    //         where: {
    //             emailAddress: 'jane.doe@example.com',
    //         },
    //     });
    // });

    test('should create a new account linked to a user', async () => {
        const accountData = {
            accountType: 'Standard',
            accountStatus: 'Active',
            username: 'jane_doe',
            password: 'securepassword',
            userID: testUser.userID,
        };

        const account = await prisma.account.create({
            data: accountData,
        });

        expect(account).toMatchObject({
            accountType: accountData.accountType,
            accountStatus: accountData.accountStatus,
            username: accountData.username,
        });

        // Ensure the account is linked to the user
        expect(account.userID).toBe(testUser.userID);
    });

    test('should retrieve an account by username', async () => {
        const username = 'jane_doe';
        const account = await prisma.account.findUnique({
            where: { username },
        });

        expect(account).toBeTruthy();
        expect(account.username).toBe(username);
    });

    test('should update an account status', async () => {
        const username = 'jane_doe';
        const newStatus = 'Suspended';

        const account = await prisma.account.update({
            where: { username },
            data: { accountStatus: newStatus },
        });

        expect(account.accountStatus).toBe(newStatus);
    });

    // Validation test for unique username
    test('should not allow creating an account with an existing username', async () => {
        const accountData = {
            accountType: 'Standard',
            accountStatus: 'Active',
            username: 'jane_doe',
            password: 'securepassword',
            userID: testUser.userID,
        };

        await expect(prisma.account.create({ data: accountData })).rejects.toThrow();
    });

    // Relationship test to fetch the associated user
    test('should fetch the user associated with an account', async () => {
        const username = 'jane_doe';
        const account = await prisma.account.findUnique({
            where: { username },
            include: { user: true },
        });

        expect(account).toBeTruthy();
        expect(account.user).toBeTruthy();
        expect(account.user.emailAddress).toBe('jane.doe@example.com');
    });

    // Error handling test for required fields
    test('should fail to create an account without required fields', async () => {
        const accountData = {
            accountType: 'Standard',
            accountStatus: 'Active',
            // username is intentionally missing
            password: 'securepassword',
            // userID is intentionally missing
        };

        await expect(prisma.account.create({ data: accountData })).rejects.toThrow();
    });
    
    // test('should delete an account', async () => {
    //     const username = 'jane_doe';

    //     await prisma.account.delete({
    //         where: { username },
    //     });

    //     const deletedAccount = await prisma.account.findUnique({
    //         where: { username },
    //     });

    //     expect(deletedAccount).toBeNull();
    // });
});
