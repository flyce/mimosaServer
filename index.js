const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('./database/mongodb');

const base = require('./router/base');
const user = require('./router/user');
const flight = require('./router/flight');
const people = require('./router/people');
const task = require('./router/task');

// middleware
const verifyToken = require('./middleware/verifyToken');
const Note = require('./utils/feedback');

// set up express app
const app = express();

// print log
app.use(logger(':remote-addr :method :url :status :response-time ms - :res[content-length]'));

//设置跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Origin, Content-Type, Accept, auth");
    res.header("Access-Control-Allow-Methods","GET,POST");
    next();
});

/***
 * static page
 */
app.use(express.static('public'));

// bodyParser
app.use(bodyParser.json());

// initialize routes
app.get('/', (req, res, next) => {
    Note(res, true, '如果你看到此信息，说明服务器正常运行。');
});

app.use("/cli", base);
app.use("/user", verifyToken, user);
app.use("/flight", verifyToken, flight);
app.use("/people", verifyToken, people);
app.use("/task", verifyToken, task);


// error handing middleware
app.use((err, req, res, next) => {
    console.log(err + '\n');
    res.status(422).json({error: err._message});
});

// listen for request
app.listen(process.env.port || 4000, function () {
    console.log('now listening port 4000 for requests');
});
