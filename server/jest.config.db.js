// jest.config.db.js
module.exports = {  // test DB only
    // jest.setup.js
    globalSetup: './__testDB__/setup.js', // This will run before any test to setup the test environment
    globalTeardown: './__testDB__/teardown.js', // This will run after all tests to clean up
    testPathIgnorePatterns: [
        "/server/__tests__",  // This tells Jest to ignore any tests in the __test__ directory
    ],
};
