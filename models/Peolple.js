const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create Comment Schema & model
const PeopleSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is required']
    },
    workshop: {
        type: Number,
        required: [true, 'workshop field is required']
    },
    grade: {
       type: String,
       required: [true, 'grade field is required']
    },
    leader: {
        type: String,
        required: [false, 'Leader field is required']
    },
    userId: {
        type: String,
        required: [false, 'UserId field is required']
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const People = mongoose.model('peoples', PeopleSchema);

module.exports = People;
