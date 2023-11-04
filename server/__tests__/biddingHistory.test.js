
const request = require('supertest');
const express = require('express');
const biddingHistoryRouter = require('../api/biddingHistory/biddingHistory');
const { log, createLogWrapper } = require('../api/Log/log');


const app = express();

// Create mock req.log object
const context = {
    userId: 'test', // You can provide the user ID as needed
    method: 'POST', // The HTTP method
    url: '/api/biddingHistory/allBidHistory', // The route URL
    ip: '127.0.0.1', // IP address
    userAgent: 'Test User Agent', // User-Agent header
};

app.use((req, res, next) => {
    req.log = createLogWrapper(context);
    next();
});

app.use(express.json());
app.use('/api/biddingHistory', biddingHistoryRouter);

describe('biddingHistory API Endpoints', () => {
    test('POST /api/biddingHistory/allBidHistory should return all bidding history records', async () => {
        const response = await request(app).post('/api/biddingHistory/allBidHistory')

        console.log(response.body);
        expect(response.status).toBe(200);
    });

    // Add more test cases for other routes as needed
});