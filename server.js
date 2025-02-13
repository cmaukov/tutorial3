require('dotenv').config(); // This loads environment variables from a .env file into process.env
const express = require('express');
const path = require('path');
const { logger } = require('./middleware/logEvents');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 3500; // port for the web server
const app = express();

// connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirements
app.use(credentials);

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

// we are only listening if we have successfully connected to MongoDB
mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    });
});

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
// });


