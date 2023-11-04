require('dotenv').config();
const { execSync } = require('child_process');

module.exports = async () => {
    // Set the test environment variable for the database URL
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    
    // Run the migrations for the test database
    execSync('npx prisma migrate deploy --preview-feature');
};
