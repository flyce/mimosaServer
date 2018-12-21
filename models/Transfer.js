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
    content: {
        type: String,
        required: [true, 'Confirm Person field is required']
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
    created: {
        type: Date,
        default: Date.now
    }
});

const Transfer = mongoose.model('transfers', TransferSchema);

module.exports = Transfer;
