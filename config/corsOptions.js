const allowedOrigins = ['https://www.google.com', 'http://another-site.com'];
const corsOptions = {
    origin: (origin, callback) =>
        (!origin || allowedOrigins.includes(origin))
            ? callback(null, true)
            : callback(new Error('Not allowed by CORS'))
};

module.exports = corsOptions;