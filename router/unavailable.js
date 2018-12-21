const express = require('express');
const router = express.Router();

const note = require('../utils/feedback');

const Unavailable = require('../models/Unavailable');

// db curd
const Update = require('../utils/curd').Update;
const Create = require('../utils/curd').Create;
const Find = require('../utils/curd').Find;
const Remove = require('../utils/curd').Remove;

router.get('/', (req, res, next) => {
   note(res, false, 'success');
});

router.post('/', (req, res, next) => {
    note(res, false, 'success');
});


module.exports = router;