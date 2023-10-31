const { log, createLogWrapper } = require('./log');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.cookies.token;
    const { method, url, ip, headers, user } = req;
    const userAgent = headers['user-agent'];
    let userId = "";
    if (!token) {
        userId = user ? user.userID : "Guest";
    } else {
        //Verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        userId = user ? user.userID : payload.accountID;
    }
    req.log = createLogWrapper(userId);  // Create a wrapped logger and attach to req
    req.log.info(`Received a ${method} request for ${url} from ${ip} User-Agent: ${userAgent}`);
    // log.info(`UserID: ${userId}, Received a ${method} request for ${url} from ${ip} User-Agent: ${userAgent}`);
    next();
};