const mysql = require('mysql')
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'autobiddata.54_255_42_49.us-east-1.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: process.env.DB_PASSWORD,
    database: 'autobiddata'
})

//connection.connect()

//connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
//    if (err) throw err

//    console.log('The solution is: ', rows[0].solution)
//})

//connection.end()

module.exports = connection;