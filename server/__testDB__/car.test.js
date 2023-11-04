const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


describe('Car Model Tests', () => {
    let testAccount;
    let createdCarID; // This will store the car ID for the created car

    // Create a test account to associate with cars before all tests
    beforeAll(async () => {
        testAccount = await prisma.account.create({
            data: {
                accountType: 'Standard',
                accountStatus: 'Active',
                username: 'john_car_owner',
                password: 'securepassword',
                user: {
                    create: {
                        firstName: 'John',
                        lastName: 'CarOwner',
                        phoneNumber: '9876543210',
                        emailAddress: 'john.carowner@example.com',
                    },
                },
            },
        });
    });

    // Clean up test data after all tests
    afterAll(async () => {
        await prisma.car.deleteMany({
            where: { accountID: testAccount.accountID },
        });

        await prisma.account.deleteMany({
            where: { userID: testAccount.userID },
        });

        await prisma.user.deleteMany({
            where: { userID: testAccount.userID },
        });
    });

    test('should create a new car linked to an account', async () => {
        const carData = {
            vehicleNumber: 'ABC123',
            make: 'TestMake',
            model: 'TestModel',
            startingBid: 10000.00,
            reservePrice: 15000.00,
            accountID: testAccount.accountID,
        };

        const car = await prisma.car.create({
            data: carData,
        });

        createdCarID = car.carID; // Store the car ID for later use

        expect(car).toMatchObject({
            vehicleNumber: carData.vehicleNumber,
            make: carData.make,
            model: carData.model,
            startingBid: carData.startingBid,
            reservePrice: carData.reservePrice,
        });

        // Ensure the car is linked to the account
        expect(car.accountID).toBe(testAccount.accountID);
    });

    test('should retrieve a car by vehicle number', async () => {
        const vehicleNumber = 'ABC123';
        const car = await prisma.car.findUnique({
            where: { carID: createdCarID },
        });

        expect(car).toBeTruthy();
        expect(car.carID).toBe(createdCarID);
    });

    test('should update a car’s details', async () => {
        const newReservePrice = 20000.00;

        const car = await prisma.car.update({
            where: { carID: createdCarID },
            data: { reservePrice: newReservePrice },
        });

        expect(car.reservePrice).toBe(newReservePrice);
    });

    // Validation Test: Try to create a car with invalid data
    test('should fail to create a car with invalid data', async () => {
        try {
            await prisma.car.create({
                data: {
                    // Invalid data: missing required fields like 'make' and 'model'
                    vehicleNumber: 'INVALID123',
                    startingBid: -10000.00, // Negative value should be invalid
                    reservePrice: 5000.00,
                    accountID: testAccount.accountID,
                },
            });
        } catch (e) {
            expect(e).toHaveProperty('message');
            expect(e.message).toMatch(/make/); // Check if 'make' is part of the error message
        }
    });

    // Relationship Test: Create a car and fetch the associated account
    test('should create a car and fetch the associated account', async () => {
        const car = await prisma.car.create({
            data: {
                vehicleNumber: 'REL123',
                make: 'RelMake',
                model: 'RelModel',
                startingBid: 11000.00,
                reservePrice: 16000.00,
                account: {
                    connect: { accountID: testAccount.accountID },
                },
            },
            include: {
                account: true, // Include the account in the result
            },
        });

        expect(car.account).toBeTruthy();
        expect(car.account.accountID).toBe(testAccount.accountID);
    });
    
    test('should delete a car', async () => {
        await prisma.car.delete({
            where: { carID: createdCarID },
        });

        const deletedCar = await prisma.car.findUnique({
            where: { carID: createdCarID },
        });

        expect(deletedCar).toBeNull();
    });
});
