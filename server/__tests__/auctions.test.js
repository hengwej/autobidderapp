const request = require('supertest');
const express = require('express');
const auctionsRouter = require('../api/auctions/auctions'); // Update the path accordingly

const app = express();
app.use(express.json());
app.use('/api/auctions', auctionsRouter);

// Set the base URL for your requests
const baseUrl = 'http://localhost:5000';

describe('Auctions API Endpoints', () => {
    test('POST /api/auctions/allAuction should return all auctions', async() => {
        const response = await request(app).post('/api/auctions/allAuction')
            .set('Host', baseUrl); // Set the base URL

        console.log(response.body);
        expect(response.status).toBe(200);
    });

    // Add more test cases for other routes as needed
});