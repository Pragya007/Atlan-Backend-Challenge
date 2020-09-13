const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
const { Worker, isMainThread } = require('worker_threads');

const app = express();
var mysqlHost = process.env.MYSQL_HOST || 'localhost';
   var mysqlPort = process.env.MYSQL_PORT || '3000';
   var mysqlUser = process.env.MYSQL_USER || 'root';
   var mysqlPass = process.env.MYSQL_PASS || '';
   var mysqlDB   = process.env.MYSQL_DB   || 'samplevideo_db';

   
// Database connection
function initialiseConnection() {
    return mysql.createConnection({
        host: mysqlHost,
        user: mysqlUser,
        password: mysqlPass,
        database: mysqlDB,
        port: mysqlPort,
        multipleStatements: true

    });
}

let connection = initialiseConnection();

connection.connect(function (err) {
    if (err)
        console.log(err);
    else {
        console.log("Successfully connected to MySQL");
    }
});

connection.query('SET autocommit=0', function () {
    console.log('Disabled Auto Commit');
})

let worker_job;

app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// Home Page
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

//This will run update gender query
app.post('/getData', function (req, res) {
    //Here gender is either male or female you can update rows having that particular gender with some 
    //other string. Here `original` is the one which is there in gender and `newVal` is the one which we want it to be.

    console.log("Creating worker thread to run the update gender query");
    if (isMainThread) {
        worker_job = new Worker('./query_runner.js', {
            workerData: {
                original: req.body.original,
                newVal: req.body.newVal
            }
        });

    } else {
        console.log(isMainThread);
    }

    res.send();
});

app.post('/pauseRequest', function (req, res) {
    console.log('Pausing Query...');
    worker_job.postMessage('pause'); // posting message of worker thread running query to pause its connection
    console.log('Paused');
    res.send('Paused');
});

app.post('/resumeRequest', function (req, res) {
    console.log('Resuming Query...');
    worker_job.postMessage('resume'); // posting message to worker thread running query to resume its connection
    console.log('Resumed');
});

app.post('/cancelRequest', function (req, res) {
    console.log("Cancelling query...");
    worker_job.postMessage('cancel'); // posting message to worker thread running query to destroy its connection
    res.send('Cancelled');
});

app.listen(PORT, function () {
    console.log('Server listening on port ', PORT);
});
