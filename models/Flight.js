const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create Comment Schema & model
const FlightSchema = new Schema({
    userId: {
        type: String,
        require: [true, 'userId field is required']
    },
    flightNo: {
        type: String,
        require: [true, 'flightNo field is required'],
        default: 'DR0000'
    },
    date: {
        type: String,
        require: [true, 'date field is required']
    }, 
    models: {
        type: String,
        require: [true, 'models field is required'],
        default: '737/C'
    },
    tail: {
        type: String,
        require: [true, 'tail field is required']
    },
    airlines: {
        type: String,
        require: [true, 'airlines field is required'],
        default: ''
    },
    plannedDeparture: {
        type: String,
        require: [true, 'Planned Departure Time field is required'],
        default: ''
    },
    estimatedDeparture: {
        type: String,
    },
    actualDeparture: {
        type: String
    },
    plannedArrived: {
        type: String,
        require: [true, 'Planned Arrived Time field is required'],
        default: ''
    },
    estimatedArrived: {
        type: String
    },
    actualArrived: {
        type: String
    },
    status: {
        type: String,
        default: '计划'
    },
    delayTime: {
        type: String
    },
    releaseTime: {
        type: String
    },
    inPlaceTime: {
        type: String
    },
    currentStatus: {
        type: String,
        require: [true, 'currentStatus field is required'],
        default: '默认'
    },
    position: {
        type: String
    },
    people: {
        type: Array
    },
    note: {
      type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const Flight = mongoose.model('flights', FlightSchema);

module.exports = Flight;
