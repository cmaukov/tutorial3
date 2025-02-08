const {format} = require('date-fns');
const {v4: uuid} = require('uuid'); // imports v4 as uuid
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;


 async function logEvents(message, fileName) {
    const dateTime = `${format(new Date().toLocaleString(),'MM-dd-yyyy\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);
    try {
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
           await fsPromises.mkdir(path.join(__dirname,'..','logs'));
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs',fileName),logItem);
    } catch (error) {
        console.error(error);
    }
}
const logger = (req,res,next)=>{
    console.log(`${req.method} ${req.path}`)
    logEvents(`${req.method}\t${req.headers.origin}\t${req.path}`, 'reqLog.txt');
    next();
    }
module.exports = {logger,logEvents} // defining the default export. in this case the logEvents function
