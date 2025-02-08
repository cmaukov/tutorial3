const express = require('express');
const path = require('path');
const {logger} = require('./middleware/logEvents');
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
app.use(express.urlencoded({extended: false}))

// built-in middleware for json
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname,'/public')));


// we are using regular expression
app.get('^/$|index(.html)?',(req,res)=>{
    console.log(req.url);
    res.sendFile('./views/index.html',{root:__dirname});
}); 
app.get('/new-page(.html)?',(req,res)=>{
    
    res.sendFile('./views/new-page.html',{root:__dirname});
}); 
app.get('/old-page(.html)?',(req,res)=>{
    
    res.redirect(301,'/new-page.html'); //by default, redirect returns status code 302
}); 
// route handlers
app.get('/hello(.html)?', (req,res,next)=>{
    console.log('attempted to load hello.html');
    next();
},(req,res)=>{
    console.log('next() calls this handler');
    res.send('hello world!');
});

// here is a more common way of chaining handlers
const one = (req,res,next)=>{
    console.log('one');
    next();
}
const two = (req,res,next)=>{
    console.log('two');
    next();
}
const three = (req,res)=>{
    console.log('three');
    res.send('Finished');
}
app.get('/chain(.html)?',[one,two, three]);

// default address
app.all('*',(req,res)=>{
    res.status(404);
    if(req.accepts('html')){
        sendFile('./views/404.html',{root:__dirname});
    }
    else if(req.accepts('json')){
        res.json({error: "404 Not Found"});
    }else{
        res.type('txt').send("404 Not Found");
    }
}); 

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

