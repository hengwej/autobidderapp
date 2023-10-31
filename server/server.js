// Importing necessary libraries and modules
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;

// Middleware configurations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',  // Adjust this to your frontend's origin
  credentials: true,  // This allows the API to accept cookies
  allowedHeaders: ['Content-Type', 'X-CSRF-Token']
}));
app.use(cookieParser());

// RBAC Middleware
function checkRole(role) {
  return (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    jwt.verify(token, 'your-secret-key', (err, decodedToken) => {
      if (err || !decodedToken) {
        return res.status(401).json({ error: 'Not authorized' });
      }

      if (decodedToken.role !== role) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      req.account = decodedToken;
      next();
    });
  };
}

// Importing route handlers
const carRoutes = require('./api/cars/sellCar');
const userRoutes = require('./api/users/users');
const accountRoutes = require('./api/accounts/accounts');
const authRoutes = require('./api/auth/auth');
const auctionRoutes = require('./api/auctions/auctions');
const bidHistoryRoutes = require('./api/biddingHistory');
const commentRoutes = require('./api/comments');
const requestRoutes = require('./api/requests');
const faqRoutes = require('./api/FAQ');
const stripeRoutes = require('./api/stripe');

// Setting up routes
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/biddingHistory', bidHistoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/FAQ', faqRoutes);
app.use('/api/stripe', stripeRoutes);

// Protected route example
app.get('/some-protected-route', checkRole('admin'), (req, res) => {
  // Your route handling code here...
  res.send('Hello, Admin!');
});

// Default route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
