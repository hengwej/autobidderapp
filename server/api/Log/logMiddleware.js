/**
 * logMiddleware.js
 * 
 * This module provides an Express middleware function for logging and user identification.
 * 
 * Features:
 * - Captures essential request details: HTTP method, URL, IP address, and user-agent.
 * - Attempts to identify the user making the request using a JWT token.
 * - Uses the createLogWrapper function from the log module to ensure consistent metadata in logs.
 * 
 * Put on server.js:
 * const logMiddleware = require('./logMiddleware.js');
 * app.use(logMiddleware);
 * 
 * Usage: 
 * req.log.<type of log>(`logging`);
 */

const { log, createLogWrapper } = require('./log');
const jwt = require('jsonwebtoken');

/**
 * Middleware function to handle logging and user identification
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

module.exports = (req, res, next) => {
    const token = req.cookies.token;
    const { method, url, ip, headers, user } = req;
    const userAgent = headers['user-agent'];
    let userId = "G";  // Default to "G"
    if (token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            userId = payload.accountID;
        } catch (error) {
            // Handle token verification errors if necessary
            if (req.log) {
                req.log.error('JWT Verification Error in logMiddleware:', error);
            } else {
                console.error('logging is not yet defined:', error);
            }
        }
    } else if (user) {
        userId = user.userID;
    }
    const context = {
        userId,
        method,
        url,
        ip,
        userAgent
    };
    req.log = createLogWrapper(context);
    req.log.info(`Received a ${method} request for ${url} from ${ip} User-Agent: ${userAgent}`);
    next();
};


