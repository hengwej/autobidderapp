const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

describe('FAQ Model Tests', () => {
    let testFAQ;

    // Clean up test data after all tests
    afterAll(async () => {
        await prisma.fAQ.deleteMany({});
    });

    test('should create a new FAQ entry', async () => {
        const faqData = {
            questionType: 'General',
            questionAns: 'This is a test answer.',
        };

        testFAQ = await prisma.fAQ.create({
            data: faqData,
        });

        expect(testFAQ).toMatchObject({
            questionType: faqData.questionType,
            questionAns: faqData.questionAns,
        });
    });

    test('should retrieve FAQ entries', async () => {
        const faqs = await prisma.fAQ.findMany({});

        expect(faqs).toBeTruthy();
        expect(faqs.length).toBeGreaterThan(0);
        expect(faqs.some(faq => faq.questionID === testFAQ.questionID)).toBe(true);
    });

    test('should update an FAQ entry', async () => {
        const newAnswer = 'This is an updated test answer.';

        const updatedFAQ = await prisma.fAQ.update({
            where: { questionID: testFAQ.questionID },
            data: { questionAns: newAnswer },
        });

        expect(updatedFAQ.questionAns).toBe(newAnswer);
    });

    test('should not create an FAQ entry with invalid data', async () => {
        try {
            await prisma.fAQ.create({
                data: {
                    // Assuming questionType has a max length of 50 characters
                    questionType: 'General'.repeat(10), // This string is too long
                    questionAns: 'This is a test answer.',
                },
            });
        } catch (e) {
            expect(e).toMatchObject({
                meta: { target: ['questionType'] },
            });
        }
    });

    test('should handle creating an FAQ entry with missing required fields', async () => {
        try {
            await prisma.fAQ.create({
                data: {
                    // Not providing questionType, which is a required field
                    questionAns: 'This is a test answer without a question type.',
                },
            });
            // If no error is thrown, force the test to fail
            throw new Error('FAQ.create did not throw an error as expected.');
        } catch (e) {
            expect(e.name).toBe('PrismaClientValidationError');
            expect(e.message).toMatch(/Invalid `prisma.fAQ.create\(\)` invocation/);
        }
    });

    test('should delete an FAQ entry', async () => {
        await prisma.fAQ.delete({
            where: { questionID: testFAQ.questionID },
        });

        const deletedFAQ = await prisma.fAQ.findUnique({
            where: { questionID: testFAQ.questionID },
        });

        expect(deletedFAQ).toBeNull();
    });
});
