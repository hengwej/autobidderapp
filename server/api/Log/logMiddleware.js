const { log, createLogWrapper } = require('./log');
const jwt = require('jsonwebtoken');

// Exporting a middleware function to handle logging and user identification
module.exports = (req, res, next) => {
    const token = req.cookies.token;  // Retrieve token from request cookies
    const { method, url, ip, headers, user } = req;  // Destructure request properties
    const userAgent = headers['user-agent'];  // Extract user-agent from headers
    let userId = "";
    if (!token) {
        userId = user ? user.userID : "Guest";  // Set userId to 'Guest' if token is absent
    } else {
        //Verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        userId = user ? user.userID : payload.accountID;  // Set userId from token payload or user object
    }
    req.log = createLogWrapper(userId);  // Create a wrapped logger instance with userId and attach to request object
    req.log.info(`Received a ${method} request for ${url} from ${ip} User-Agent: ${userAgent}`);  // Log the request details
    // log.info(`UserID: ${userId}, Received a ${method} request for ${url} from ${ip} User-Agent: ${userAgent}`);
    next();  // Proceed to the next middleware function in the stack
};