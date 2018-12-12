const mongoose = require('mongoose');
const config = require('../config');
/***
 * mongodb
 */
mongoose.connect(config.mongodbUri);

const db = mongoose.connection;

// db info listener
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("mongodb connected!");
});

mongoose.Promise = global.Promise;

module.exports = mongoose;