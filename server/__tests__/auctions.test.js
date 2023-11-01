const request = require('supertest');
const express = require('express');
const auctionsRouter = require('../api/auctions/auctions'); // Update the path accordingly

const app = express();
app.use(express.json());
app.use('/api/auctions', auctionsRouter);

describe('Auctions API Endpoints', () => {
    test('GET /api/auctions/allAuction should return all auctions', async() => {
        const response = await request(app).post('/api/auctions/allAuction');
        expect(response.status).toBe(200);
        //expect(response.body).toHaveLength(2); // Update the expected length according to your test data
    });

    // Add more test cases for other routes as needed
});