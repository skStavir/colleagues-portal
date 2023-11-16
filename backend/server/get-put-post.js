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
app.post("/employees", (req, res) => {
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

            
        }
    });
});


// Define a route to update an employee's information
app.put('/emp_update/:employee_id', (req, res) => {
    const employeeId = req.params.employee_id;
    const {
        employee_name,
        designation,
        phone_number,
        email,
        joining_date,
        leaving_date,
        reporting_manager_id,
        address
    } = req.body;

    if (!employee_name || !designation || !phone_number || !email || !joining_date || !leaving_date || !reporting_manager_id || !address) {
        res.status(400).json({ error: 'Bad request - Missing data' });
        return;
    }

    const query = `UPDATE empdata 
                   SET employee_name = ?, designation = ?, phone_number = ?, email = ?, joining_date = ?, leaving_date = ?, reporting_manager_id = ?, address = ?
                   WHERE employee_id = ?`;

    connection.query(query, [employee_name, designation, phone_number, email, joining_date, leaving_date, reporting_manager_id, address, employeeId], (err, result) => {
        if (err) {
            console.error('Error updating employee data: ' + err.message);
            res.status(404).json({ error: 'Employee does not exist' });
            return;
        }

        if (result.affectedRows > 0) {
            res.status(201).json({ message: 'Employee updated successfully' });
        } else {
            res.status(404).json({ error: 'Employee does not exist' });
        }
    });
});

// Define a route to get employee data
app.get('/employees', (req, res) => {
    const query = 'SELECT employee_id, employee_name, designation, phone_number, email, joining_date, leaving_date, reporting_manager_id, address FROM empdata';
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error querying the database: ' + err.message);
        res.status(500).send('An error occurred while fetching employee data.');
        return;
      }
  
      res.json(results);
    });
  });
// Create a POST route for adding timesheet data
app.post('/timesheet', (req, res) => {
    const { timesheet_id, employee_id,date, working_hours, leaves, holiday } = req.body;

    if (!timesheet_id || !employee_id || !date || working_hours === undefined || leaves === undefined || holiday === undefined) {
        res.status(400).json({ error: "Invalid request payload" });
        return;
    }

    const insertOrUpdateQuery = `
        INSERT INTO emptimesheet (timesheet_id, employee_id , date, working_hours, leaves, holiday)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        employee_id = VALUES(employee_id),
        date = VALUES(date),
        working_hours = VALUES(working_hours),
        leaves = VALUES(leaves),
        holiday = VALUES(holiday)

    `;

    connection.query(insertOrUpdateQuery, [timesheet_id, employee_id, date, working_hours, leaves, holiday], (err, results) => {
        if (err) {
            console.error("Database error: " + err.message); // Log the detailed error message
            res.status(500).json({ error: "Database error: " + err.message }); // Send the error message to the client
            return;
        }

        if (results.affectedRows > 0) {
            res.status(201).json({ message: "Timesheet added" });
        } else {
            res.status(500).json({ error: "Failed to add or update timesheet" });
        }
    });
});


// Listen on the specified port
app.listen(port, () => console.log(`Server listening at the port ${port}`));
