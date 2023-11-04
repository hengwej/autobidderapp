const NodeEnvironment = require('jest-environment-node');
require('dotenv').config();

class PrismaTestEnvironment extends NodeEnvironment {
    constructor(config, context) {
        super(config, context);
        this.testPath = context.testPath;
    }

    async setup() {
        // Set the test environment variable for the database URL
        process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

        // Require the Prisma Client inside the setup method to ensure
        // the environment variable is set before it's imported
        const { PrismaClient } = require('@prisma/client');

        // Instantiate a new Prisma Client
        this.global.prisma = new PrismaClient();

        // Connect to the database
        await this.global.prisma.$connect();

        // Call the setup method of the parent class (NodeEnvironment)
        await super.setup();
    }

    async teardown() {
        // Disconnect the Prisma Client to close the database connections
        await this.global.prisma.$disconnect();

        // Call the teardown method of the parent class (NodeEnvironment)
        await super.teardown();
    }

    runScript(script) {
        return super.runScript(script);
    }
}

module.exports = PrismaTestEnvironment;
