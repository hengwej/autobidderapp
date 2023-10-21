require('express-async-errors');

const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',  // Adjust this to your frontend's origin
  credentials: true  // This allows the API to accept cookies
}));


const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const csurf = require('csurf');


//app.use(cookieParser()); // Parse cookies
//app.use(helmet());       // Set basic security headers
//app.use(csurf({ cookie: true }));

//app.use(csurf({
//  cookie: true,
//  value: (req) => req.headers['csrf-token']
//}));


//app.use((err, req, res, next) => {
//  if (err.code !== 'EBADCSRFTOKEN') return next(err);
//  console.log("Received CSRF token in headers:", req.headers['csrf-token']);
//  console.log("Expected CSRF token:", req.csrfToken());
//  console.log("CSRF token validation failed!");
//  res.status(403).json({ error: 'Session has expired or form tampered with' });
//
//});





const carRoutes = require('./api/cars');
const userRoutes = require('./api/users');
const accountRoutes = require('./api/accounts');
const authRoutes = require('./api/auth/auth');
const auctionRoutes = require('./api/auctions');
const bidHistoryRoutes = require('./api/biddingHistory');


app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/biddingHistory', bidHistoryRoutes);


app.get('/', (req, res) => {
  res.send('Hello from Express!');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

});

