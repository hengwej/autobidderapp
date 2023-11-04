// Importing necessary libraries and modules
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const rateLimitHeaderParser = require('ratelimit-header-parser');
const { findAndScheduleAuctions } = require('./utils/CheckAuction');


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
    // Create the accountLog wrapper at the beginning
    const accountLog = createLogWrapper(token ? jwt.decode(token).id : 'Guest');

    if (!token) {
      accountLog.warn('No token provided');
      return res.status(401).json({ error: 'Not authorized' });
    }

    jwt.verify(token, 'your-secret-key', (err, decodedToken) => {
      if (err || !decodedToken) {
        accountLog.error('Token verification failed');
        return res.status(401).json({ error: 'Not authorized' });
      }

      if (decodedToken.role !== role) {
        accountLog.warn('Incorrect role');
        return res.status(403).json({ error: 'Forbidden' });
      }

      req.account = decodedToken;
      accountLog.info(`Role check successful `);
      next();
    });
  };
}




// Rate limiting configurations
// Set up rate limiter: maximum of five requests per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 5 requests per windowMs
  headers: true, // Add rate limit info to the `RateLimit-*` headers
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // Allow 5 requests per 15 minutes.
  delayMs: (hits) => hits * 100, // Add 100 ms of delay to every request after the 5th one.
})

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Apply the speed limiting middleware to all requests
app.use(speedLimiter);


// Importing route handlers
const { log, createLogWrapper } = require('./api/Log/log');
const logMiddleware = require('./api/Log/logMiddleware');
const carRoutes = require('./api/cars/sellCar');
const userRoutes = require('./api/users/users');
const accountRoutes = require('./api/accounts/accounts');
const authRoutes = require('./api/auth/auth');
const auctionRoutes = require('./api/auctions/auctions');
const bidHistoryRoutes = require('./api/biddingHistory/biddingHistory');
const requestRoutes = require('./api/requests/requests');
const faqRoutes = require('./api/FAQ/FAQ');
const stripeRoutes = require('./api/stripe/stripe');

// Setting up routes
app.use(logMiddleware);
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/biddingHistory', bidHistoryRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/FAQ', faqRoutes);
app.use('/api/stripe', stripeRoutes);

// Protected route example
app.get('/some-protected-route', checkRole('admin'), (req, res) => {
  // Your route handling code here...
  req.log.info('This protected route');
  res.send('Hello, Admin!');
});

// Default route
app.get('/', (req, res) => {
  req.log.info('This default route');
  res.send('Hello from the other side~ ai!');
});

//test error log
app.get('/error', (req, res, next) => {
  req.log.trace('This is a trace log message');
  req.log.debug('This is a debug log message');
  req.log.info('This is an info log message');
  req.log.warn('This is a warn log message');
  req.log.error('This is an error log message');
  req.log.fatal('This is a fatal log message');
  // This will trigger an error
  throw new Error('Intentional error for testing');
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  log.info({ message: `Server is running on port ${port}` });
  findAndScheduleAuctions();
});

// app.use((err, req, res, next) => {
//     req.log.error({ message: err.message, stack: err.stack });
//     res.status(500).send('Something went wrong!');
// });
