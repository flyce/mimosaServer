const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create Comment Schema & model
const UnavailableSchema = new Schema({
    userId: {
        type: String,
        require: [true, 'userId field is required']
    },
    date: {
        type: String,
        require: [true, 'date field is required']
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const Unavailable = mongoose.model('unavailables', UnavailableSchema);

module.exports = Unavailable;
