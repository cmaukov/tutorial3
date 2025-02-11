const allowedOrigins = require('../config/allowedOrgins');

const credentials = (req, res, next) => {
    const orgin = req.headers.orgin;
    if (allowedOrigins.includes(orgin)) {
        res.header('Access-Control-Allow-Credentials', true)
    }
    next();
};

module.exports = credentials;