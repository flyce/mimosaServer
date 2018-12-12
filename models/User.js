const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create Comment Schema & model
const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username field is required']
    },
    name: {
        type: String,
        required: [true, 'Name field is required']
    },
    position: {
        type: String,
        required: [true, 'Position field is required']
    },
    workshop: {
        type: Number,
        required: [true, 'workshop field is required']
    },
    mail: {
        type: String,
        required: [true, 'Mail field is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone field is required']
    },
    password: {
        type: String,
        required: [true, 'Password field is required']
    },
    admin: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },
    headImageUrl: {
        type: String
    },
    lastLogin: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
