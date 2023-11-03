
const request = require('supertest');
const express = require('express');
const auctionsRouter = require('../api/auctions/auctions'); // Update the path accordingly
const logMiddleware = require('../api/Log/logMiddleware');
const { log, createLogWrapper } = require('../api/Log/log');


const app = express();

const context = {
    userId: 'G', // You can provide the user ID as needed
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

// Set the base URL for your requests
const baseUrl = 'http://localhost:5000';

describe('Auctions API Endpoints', () => {
    test('POST /api/auctions/allAuction should return all auctions', async() => {
        const response = await request(app).post('/api/auctions/allAuction')
<<<<<<< HEAD
=======
            .set('Host', baseUrl); // Set the base URL
>>>>>>> 9b6d20f5c0f4f7f8260eadf0ae3cced5d664b14f

        console.log(response.body);
        expect(response.status).toBe(200);
    });

    // Add more test cases for other routes as needed
});