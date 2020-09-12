const worker = require('worker_threads');
const mysql = require('mysql');


worker.parentPort.on('message', function (message) {
    console.log(message);
    if (message == 'pause') {
        console.log('...Pausing connection');
        connection.pause();
    }
    if (message == 'resume') {
        console.log('...Resuming connection');
        connection.resume();
    }
    if (message == 'cancel') {
        console.log('...Cancelling the working thread');
        // Killing the query
        connection.destroy();
        console.log('Connection Destroyed');
        connection = initialiseConnection();
        console.log('Killing Thread ', worker.threadId);
        process.exit(0);
    }
});

// Database connection
function initialiseConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'samplevideo_db',
        multipleStatements: true
    });
}

let connection = initialiseConnection();


function getDataForDateRange(original, newVal) {
    connection.beginTransaction(function (err) {
        console.log('Transaction is begining...')
        console.log('Transaction Thread ID: ', worker.threadId);
        if (err) { throw err; } // throw custom error here.

        let sql = 'SELECT SLEEP(10); update user_details set gender=? where gender = ?; SELECT SLEEP(10); ';

        console.log('Query has been started...');

        connection.query(sql, [newVal, original], function (err, rows, fields) {
            console.log('Query is running...');
            console.log('Query Thread ID: ', connection.threadId);
            if (err) {
                throw err;
            }

            // All queries are successfully updated, and ready to commit.
            connection.commit(function (err) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }
                console.log('Transaction Successfully Completed');
            });

        });
    });
}


const original = worker.workerData.original;
const newVal = worker.workerData.newVal;

console.log('Thread ID: ', worker.threadId);
getDataForDateRange(original, newVal);

