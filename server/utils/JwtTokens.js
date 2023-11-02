const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token from cookies.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const checkJwtToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.log.warn('Unauthorized: No token provided');  // Use a proper logging mechanism
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Add the user payload to the request object
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // Handle token expiration. For example:
            // 1. Refresh the token if you have a refresh token implemented.
            // 2. Redirect the user to the login page.
            // 3. Provide a helpful error message to the user.
            req.log.warn('Token has expired');  // Updated logging method
            return res.status(401).json({ error: 'Unauthorized: Token has expired' });
        }

        req.log.error(`JWT Verification Error: ${error.message}`);  // Updated logging method
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = checkJwtToken;
