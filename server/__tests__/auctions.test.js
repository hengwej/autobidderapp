const request = require('supertest');
const express = require('express');
const auctionsRouter = require('../api/auctions/auctions'); // Update the path accordingly

const app = express();
app.use(express.json());
app.use('/api/auctions', auctionsRouter);

describe('Auctions API Endpoints', () => {
    test('POST /api/auctions/allAuction should return all auctions', async() => {
        const response = await request(app).post('/api/auctions/allAuction');
        console.log(response.body);
        expect(response.status).toBe(200);
    });

    // Add more test cases for other routes as needed
});