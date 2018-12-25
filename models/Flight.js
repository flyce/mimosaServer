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
        require: [true, 'flightNo field is required']
    },
    date: {
        type: String,
        require: [true, 'date field is required']
    }, 
    models: {
        type: String,
        require: [true, 'models field is required']
    },
    tail: {
        type: String,
        require: [true, 'tail field is required']
    },
    airlines: {
        type: String,
        require: [true, 'airlines field is required']
    },
    plannedDeparture: {
        type: String,
        require: [true, 'Planned Departure Time field is required']
    },
    estimatedDeparture: {
        type: String,
        require: [true, 'Estimated Departure Time field is required']
    },
    actualDeparture: {
        type: String
    },
    plannedArrived: {
        type: String,
        require: [true, 'Planned Arrived Time field is required']
    },
    estimatedArrived: {
        type: String
    },
    actualArrived: {
        type: String
    },
    status: {
        type: String,
        require: [true, 'status field is required'],
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
