const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI
           /* , {
                useUnifiedTopology: true,
                useNewUrlParser: true
            } */ // deprecated options that have no effect since Driver version 4.0.0
        );
    } catch (err) {
        console.error(err);
    }
};

module.exports = connectDB;