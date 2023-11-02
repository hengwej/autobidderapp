const jwt = require('jsonwebtoken');

/**
 * @description Middleware to check if the user has the specified role.
 * This middleware function verifies the JWT token from the client's cookies and checks if the user's role matches the specified role.
 * If the role matches, the middleware calls the next function in the middleware chain.
 * If the role doesn't match or if there's an error, the middleware sends an appropriate error response.
 * 
 * @param {string} role - The role to check against.
 * @returns {Function} - Express middleware function.
 */
function checkRole(role) {
    return (req, res, next) => {
        req.log.info(`Checking role for ${role}`);  // Logging the start of role checking
        const token = req.cookies.token;
        if (!token) {
            req.log.warn('No token provided');  // Logging when no token is found
            return res.status(401).json({ error: 'Authentication required. Please log in.' });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err || !decodedToken) {
                req.log.warn(`Token verification failed: ${err ? err.message : 'No decoded token'}`);  // Logging when token verification fails
                return res.status(401).json({ error: 'Invalid token. Please log in again.' });
            }
            if (decodedToken.role !== role) {
                req.log.warn(`User role "${decodedToken.role}" does not match required role: ${role}`);  // Logging when role does not match
                return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
            }
            req.account = decodedToken;  // Attach the decoded token to the request object
            next();  // Move to the next middleware in the chain
        });
    };
}

module.exports = {
    checkRole
};
