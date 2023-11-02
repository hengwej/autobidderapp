const jwt = require('jsonwebtoken');

const checkJwtToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Add the user payload to the request object
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            //TODO
            // You can handle token expiration here. For example:
            // 1. Refresh the token if you have a refresh token implemented.
            // 2. Redirect the user to login page.
            // 3. Provide a helpful error message to the user.

            return res.status(401).json({ error: 'Unauthorized: Token has expired' });
        }

        console.error("JWT Verification Error:", error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = checkJwtToken;
