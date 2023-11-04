
const request = require('supertest');
const express = require('express');
const accountsRouter = require('../api/accounts/accounts');
const { log, createLogWrapper } = require('../api/Log/log');


const app = express();

// Create mock req.log object
const context = {
    userId: 'test', // You can provide the user ID as needed
    method: 'POST', // The HTTP method
    url: '/api/accounts/allAccount', // The route URL
    ip: '127.0.0.1', // IP address
    userAgent: 'Test User Agent', // User-Agent header
};

app.use((req, res, next) => {
    req.log = createLogWrapper(context);
    next();
});

app.use(express.json());
app.use('/api/accounts', accountsRouter);

describe('accounts API Endpoints', () => {
    test('POST /api/accounts/allAccount should return all accounts', async () => {
        const response = await request(app).post('/api/accounts/allAccount')

        expect(response.status).toBe(200);
    });

    // Add more test cases for other routes as needed
});