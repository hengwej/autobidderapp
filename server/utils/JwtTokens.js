const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token from cookies.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const checkJwtToken = (req, res, next) => {

    const isTestEnvironment = process.env.REACT_APP_ENVIRONMENT === 'test';

    if (!isTestEnvironment){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;  // Add the user payload to the request object
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                req.log.warn('Token has expired');  // Updated logging method
    
                // Clear the cookies in case of token expiration
                res.clearCookie('token', { path: '/', httpOnly: true, secure: true, sameSite: 'Strict' });
                res.clearCookie('csrfToken', { path: '/', httpOnly: true, secure: true, sameSite: 'Strict' });
    
                // Send a response to the frontend to take the user to the logout flow
                return res.status(401).json({
                    error: 'Unauthorized: Token has expired',
                    action: 'logout' // Indicate that the frontend should redirect to the logout route or procedure
                });
            }
        }
    }

    next();
};

module.exports = checkJwtToken;
