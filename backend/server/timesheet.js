const express = require("express");
const app = express();
const port = 3000;
let bodyParser = require('body-parser');
app.use(bodyParser.json());
const mysql = require('mysql2')
const connection = mysql.createConnection({
    user: 'root',
    host: '127.0.0.1',
    database: 'emptime',
    password: 'password@123',
    port: 3307 
});
// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database');
});

// Post data into the "empdata" table
app.post("/timesheet", (req, res) => {
    const empData = req.body;
    console.log(empData);
    // TODO make the code proper   
});



