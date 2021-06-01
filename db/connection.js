const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'SPNF@N96',
        database: 'employeeTracker'
    }
);

module.exports = db;