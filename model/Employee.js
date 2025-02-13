const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    fistname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Employee',employeeSchema); //Mongoose automatically looks for the plural, lowercase version of the model name. In our example it is Employee, so Mongoose will look for employees collection in the database