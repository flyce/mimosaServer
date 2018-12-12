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
const People = require('../models/Peolple');

router.get('/', (req, res, next) => {
    Find(People, res, {key: {userId: '5c0dfb7f607713088c65d221'}, limit: req.query.limit});
});

router.post('/', (req, res, next) => {
    Create(People, res, {
        userId: '5c0dfb7f607713088c65d221',
        ...req.body,
    });
});

router.post('/update', (req, res, next) => {
    const { _id } = req.body;
    delete req.body._id;
    Update(People, res, {key: {_id}, content: req.body});
});

router.post('/delete', (req, res, next) => {
    Remove(People, res, {...req.body});
});

module.exports = router;