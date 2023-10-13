const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;
app.use(cors());

const mysql = require('mysql')
const database = require('./database.js');

//database.connect((err => {
//    if (err) throw err;
//    console.log('MySQL Connected');
//}));

//app.get('/inventory', (req, res) => {
//    let sql = 'SELECT * FROM inventory';
//    connection.query(sql, (err, result) => {
//        if (err) throw err;
//        console.log(result);
//        res.send('Inventory received');
//    });
//});

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});