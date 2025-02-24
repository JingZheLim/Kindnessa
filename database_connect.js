const mysql = require('mysql');

var connect = mysql.createConnection({
    host: 'localhost',
    database: 'kindnessa' // change this back to kindnessa
});

connect.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

module.exports = connect;