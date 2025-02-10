const express = require('express');
const path = require('path');
const { logger } = require('./middleware/logEvents');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler')

const PORT = process.env.PORT || 3500; // port for the web server
const app = express();

// custom middleware logger
app.use(logger);

// Cross Orgin Resource Sharing
const allowedOrigins = ['https://www.google.com', 'http://another-site.com'];
const corsOptions = {
    origin: (origin, callback) =>
        (!origin || allowedOrigins.includes(origin))
            ? callback(null, true)
            : callback(new Error('Not allowed by CORS'))
};
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/employees', require('./routes/api/employee'));

// default address
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile('./views/404.html', { root: __dirname });
    }
    else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

