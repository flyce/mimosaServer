const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create Comment Schema & model
const TransferSchema = new Schema({
    handover: {
        type: String,
        required: [true, 'Handover Person field is required']
    },
    receiver: {
        type: String
    },
    confirm: {
        type: Boolean,
        default: false
    },
    clean: {
        type: Number,
        required: [true, 'clean Person field is required'],
        default: 2
    },
    car: {
        type: Number,
        required: [true, 'car field is required'],
        default: 2,
    },
    faultRetention: {
        type: String,
        required: [true, 'Fault Retention field is required']
    },
    keyMonitoringFaults: {
        type: String,
        required: [true, 'Key Monitoring Faults field is required']
    },
    aircraftConditions: {
        type: String,
        required: [true, 'Aircraft Conditions  field is required']
    },
    administrativeRequirements: {
        type: String,
        required: [true, 'Administrative Requirements field is required']
    },
    note: {
        type: String
    },
    handoverName: {
        type: String,
        required: [true, 'Handover Name field is required']
    },
    handoverWorkshop: {
        type: Number,
        required: [true, 'Workshop Name field is required']
    },
    receiverName: {
        type: String
    },
    receiverWorkshop: {
        type: Number
    },
    timestamp: {
        type: Number,
        default: Math.floor(Date.now() / 1000)
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const Transfer = mongoose.model('transfers', TransferSchema);

module.exports = Transfer;
