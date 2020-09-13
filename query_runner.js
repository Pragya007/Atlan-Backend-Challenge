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


function queryExec(original, newVal) {
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
queryExec(original, newVal);

