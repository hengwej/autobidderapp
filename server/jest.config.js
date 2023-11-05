// test all
module.exports = {
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    globalSetup: './__testDB__/setup.js', // This will run before any test to setup the test environment
    globalTeardown: './__testDB__/teardown.js', // This will run after all tests to clean up
};
