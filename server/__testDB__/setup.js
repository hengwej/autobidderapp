require('dotenv').config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.test'
});
const { execSync } = require('child_process');

module.exports = async () => {
    // Run the migrations for the test database
    execSync('npx prisma migrate deploy --preview-feature');
};
