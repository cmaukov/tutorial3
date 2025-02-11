const express = require('express');
const path = require('path');
const { logger } = require('./middleware/logEvents');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3500; // port for the web server
const app = express();

// custom middleware logger
app.use(logger);

// Cross Orgin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT); // any route listed below this line will require authentication token
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

