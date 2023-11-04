// unit testing
module.exports = {
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    testPathIgnorePatterns: [
        "/server/__testDB__",  // This tells Jest to ignore any tests in the __testDB__ directory
    ],
};
