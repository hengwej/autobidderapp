const crypto = require('crypto');

/**
 * Securely compares two strings to prevent timing attacks.
 * @param {string} a - First string.
 * @param {string} b - Second string.
 * @returns {boolean} - True if strings are equal, false otherwise.
 */
function secureCompare(a, b) {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Middleware to verify CSRF token from headers against the token in cookies.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const csrfProtection = (req, res, next) => {

    const isTestEnvironment = process.env.REACT_APP_ENVIRONMENT === 'test';

    if (!isTestEnvironment){
        const csrfTokenHeader = req.headers['x-csrf-token'];
        const csrfTokenCookie = req.cookies.csrfToken;

        req.log.info("Verifying CSRF tokens");  // Use a proper logging mechanism

        if (!csrfTokenHeader) {
            req.log.warn('CSRF token is missing in headers');  // Updated logging method
            return res.status(403).json({ error: 'CSRF token is missing in headers' });
        }
        if (!csrfTokenCookie) {
            req.log.warn('CSRF token is missing in cookies');  // Updated logging method
            return res.status(403).json({ error: 'CSRF token is missing in cookies' });
        }
        if (!secureCompare(csrfTokenHeader, csrfTokenCookie)) {
            req.log.warn('CSRF token mismatch');  // Updated logging method
            return res.status(403).json({ error: 'CSRF token mismatch' });
        }
    }

    // If CSRF tokens match, proceed to the next middleware or route handler
    next();
};

module.exports = csrfProtection;
