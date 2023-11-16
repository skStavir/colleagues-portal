const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise'); // Use the promise-based version of mysql2

// Create a connection pool
const pool = mysql.createPool({
    user: 'root',
    host: '127.0.0.1',
    database: 'emptime',
    password: 'password@123',
    port: 3307,
    connectionLimit: 10, // Adjust the connection limit as needed
});

// Insert data into the "empdata" table
app.post("/employee", async (req, res) => {
    const empData = req.body;
    console.log(empData);

    // Generate a new UUID for the employee_id and convert it to a string
    const employee_id = uuidv4().toString();
    if (!empData.employee_name || !empData.designation || !empData.phone_number || !empData.email) {
        res.status(400).send("Missing required fields.");
        return;
    }

    try {
        const connection = await pool.getConnection();
        // Use a parameterized query to insert data into the database
        const query = {
            text: 'INSERT INTO empdata(employee_id, employee_name, designation, phone_number, email, joining_date, leaving_date, reporting_manager_id, address) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
            values: [
                employee_id,
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

        const [rows] = await connection.execute(query.text, query.values);
        connection.release(); // Release the connection back to the pool
        console.log('Data inserted successfully');
        res.send("Entry inserted");
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Error inserting data');
    }
});

// Define a route to get employee data
app.get('/emp_getdata', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const query = 'SELECT employee_id, employee_name, designation, phone_number, email, joining_date, leaving_date, reporting_manager_id, address FROM empdata';
        const [results] = await connection.execute(query);
        connection.release(); // Release the connection back to the pool
        res.json(results);
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).send('An error occurred while fetching employee data.');
    }
});


// Listen on the specified port
app.listen(port, () => console.log(`Server listening at the port ${port}`));
