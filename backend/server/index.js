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


// app.get("/timesheet", (req, res) => {
//     res.json(timesheet);
// });

// Insert data into the "empdata" table
app.post("/fetchdata", (req, res) => {
    const empData = req.body;
    console.log(empData);

    const query = {
        text: 'INSERT INTO empdata(employee_id,employee_name, designation, phone_number, email, joining_date, leaving_date, reporting_manager_id,address) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
        values: [
            empData.employee_id,
            empData.employee_name,
            empData.designation,
            empData.phone_number,
            empData.email,
            empData.joining_date,
            empData.leaving_date,
            empData.reporting_manager_id,
            empData.address
        ],
    };

    connection.query(
        'INSERT INTO empdata(employee_id,employee_name, designation, phone_number, email, joining_date, leaving_date, reporting_manager_id, address) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            empData.employee_id,
            empData.employee_name,
            empData.designation,
            empData.phone_number,
            empData.email,
            empData.joining_date,
            empData.leaving_date,
            empData.reporting_manager_id,
            empData.address  
        ],
         (error, result) => {
        if (error) {
            console.error('Error inserting data:', error);
            res.status(500).send('Error inserting data');
        } else {
            console.log('Data inserted successfully');
            res.send("Entry inserted");

            //console.log('Query results: ', results);
        }
    });
});

// Listen on the specified port
app.listen(port, () => console.log(`Server listening at the port ${port}`));
