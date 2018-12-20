const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create Comment Schema & model
const TaskSchema = new Schema({
    flightId: {
        type: String,
        required: [true, 'flightId field is required']
    },
    flightNo: {
        type: String,
        required: [true, 'flightNo field is required']
    },
    name: {
        type: String,
        required: [true, 'name field is required']
    },
    startTime: {
        type: String,
        required: [true, 'startTime field is required']
    },
    endTime: {
        type: String,
        required: [true, 'endTime field is required']
    },
    date: {
        type: String,
        required: [true, 'date field is required']
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model('tasks', TaskSchema);

module.exports = Task;
