
const request = require('supertest');
const express = require('express');
const auctionsRouter = require('../api/auctions/auctions');
const { log, createLogWrapper } = require('../api/Log/log');


const app = express();

// Create mock req.log object
const context = {
    userId: 'test', // You can provide the user ID as needed
    method: 'POST', // The HTTP method
    url: '/api/auctions/allAuction', // The route URL
    ip: '127.0.0.1', // IP address
    userAgent: 'Test User Agent', // User-Agent header
};

app.use((req, res, next) => {
    req.log = createLogWrapper(context);
    next();
});

app.use(express.json());
app.use('/api/auctions', auctionsRouter);

describe('auctions API Endpoints', () => {
    test('POST /api/auctions/allAuction should return all auctions', async () => {
        const response = await request(app).post('/api/auctions/allAuction')
        expect(response.status).toBe(200);
    });
});