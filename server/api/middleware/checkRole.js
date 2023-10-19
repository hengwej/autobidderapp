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

module.exports = {
    checkRole
};