const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('User Model Tests', () => {
    // Test user data
    const testUserData = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        emailAddress: 'john.doe@example.com',
        address: '123 Main St'
    };

    // Clean up the test environment before and after each test
    beforeEach(async () => {
        await prisma.user.deleteMany({
            where: {
                emailAddress: testUserData.emailAddress,
            },
        });
    });

    afterEach(async () => {
        await prisma.user.deleteMany({
            where: {
                emailAddress: testUserData.emailAddress,
            },
        });
    });

    test('should create a new user', async () => {
        const user = await prisma.user.create({
            data: testUserData,
        });

        expect(user).toMatchObject({
            firstName: testUserData.firstName,
            lastName: testUserData.lastName,
            phoneNumber: testUserData.phoneNumber,
            emailAddress: testUserData.emailAddress,
            address: testUserData.address,
        });
    });

    test('should retrieve a user by email address', async () => {
        await prisma.user.create({ data: testUserData });

        const user = await prisma.user.findUnique({
            where: { emailAddress: testUserData.emailAddress },
        });

        expect(user).toMatchObject(testUserData);
    });

    test('should update a user’s details', async () => {
        const user = await prisma.user.create({ data: testUserData });

        const updatedLastName = 'Smith';
        const updatedUser = await prisma.user.update({
            where: { userID: user.userID },
            data: { lastName: updatedLastName },
        });

        expect(updatedUser.lastName).toBe(updatedLastName);
    });

    // Validation test: creating a user without a required field
    test('should not create a user without an email address', async () => {
        await expect(prisma.user.create({
            data: {
                ...testUserData,
                emailAddress: null, // intentionally set to null to trigger validation
            },
        })).rejects.toThrow();
    });

    // Relationship test: creating a user and associated account
    test('should create a user with associated accounts', async () => {
        const user = await prisma.user.create({
            data: {
                ...testUserData,
                accounts: {
                    create: [{
                        accountType: 'Premium',
                        accountStatus: 'Active',
                        username: 'johndoe_premium',
                        password: 'securepassword', // Remember to hash in production
                    }],
                },
            },
            include: {
                accounts: true, // Include the accounts in the response
            },
        });

        expect(user.accounts).toHaveLength(1);
        expect(user.accounts[0].username).toBe('johndoe_premium');
    });

    // Error handling test: handling duplicate email addresses
    test('should not allow duplicate email addresses', async () => {
        // Create a user with the test email address
        await prisma.user.create({ data: testUserData });

        // Attempt to create another user with the same email address
        await expect(prisma.user.create({ data: testUserData })).rejects.toThrow();
    });

    test('should delete a user', async () => {
        const user = await prisma.user.create({ data: testUserData });

        await prisma.user.delete({
            where: { userID: user.userID },
        });

        const deletedUser = await prisma.user.findUnique({
            where: { userID: user.userID },
        });

        expect(deletedUser).toBeNull();
    });
});
