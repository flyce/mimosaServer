const express = require('express');
const router = express.Router();

// db curd
const Update = require('../utils/curd').Update;
const Create = require('../utils/curd').Create;
const Find = require('../utils/curd').Find;
const Remove = require('../utils/curd').Remove;

// feedback
const note = require('../utils/feedback');

// Model
const Transfer = require('../models/Transfer');

router.get('/', (req, res, next) => {
    Find(Transfer, res, { key: {timestamp: {$gt: Math.floor(Date.now() / 1000 - 11 * 3600)}}});
});

router.post('/', (req, res, next) => {
    console.log(req.body);
    // note(res, true, "a")
    Create(Transfer, res, {handover: req.headers["_id"], handoverWorkshop: req.headers["workshop"], ...req.body});
});

router.post('/update', (req, res, next) => {
    console.log(req.body);
    const { _id } = req.body;
    Update(Transfer, res, {
        key: {_id},
        content:
            {...req.body}
    });
});

router.post('/confirm', (req, res, next) => {
    const { _id } = req.body;
    Update(Transfer, res, {
        key: {_id},
        content:
            {
                receiver: req.headers["_id"],
                confirm: req.body.confirm,
                receiverWorkshop: req.headers["workshop"],
                receiverName: req.body.receiverName
            }
    });
});

router.post('/delete', (req, res, next) => {
    Remove(Transfer, res, {flightId: req.body.flightId, name: req.body.name});
});

module.exports = router;