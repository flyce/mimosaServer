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
const Task = require('../models/Task');

router.get('/', (req, res, next) => {
    Find(Task, res, { key: {name: req.query.name, date: req.query.date}});
});

router.post('/', (req, res, next) => {
    Create(Task, res, {...req.body});
});

router.post('/delete', (req, res, next) => {
    Remove(Task, res, {flightId: req.body.flightId, name: req.body.name});
});


module.exports = router;