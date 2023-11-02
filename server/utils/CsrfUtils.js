const csrfProtection = (req, res, next) => {
    const csrfTokenHeader = req.headers['x-csrf-token'];
    const csrfTokenCookie = req.cookies.csrfToken;

    //console.log("csrfTokenHeader: " + csrfTokenHeader);
    //console.log("CSRF Token Cookie: " + csrfTokenCookie);

    if (!csrfTokenHeader) return res.status(403).json({ error: 'CSRF token is missing in headers' });
    if (!csrfTokenCookie) return res.status(403).json({ error: 'CSRF token is missing in cookies' });
    if (csrfTokenHeader !== csrfTokenCookie) {
        return res.status(403).json({ error: 'CSRF token mismatch' });
    }

    // If CSRF tokens match, proceed to the next middleware or route handler
    next();
};

module.exports = csrfProtection;
