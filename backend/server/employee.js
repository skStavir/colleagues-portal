const { v4: uuidv4 } = require('uuid');
var dbConnectionPool = require('./db.js');
const express = require('./parent.js')
var employeeAPIs = express.Router();

// Middleware to check and validate the token
const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).send('Unauthorized - Token missing');
    }

    try {
        // Fetch token and expiry time from empcred table
        const connection = await dbConnectionPool.getConnection();
        const query = 'SELECT token, expiryTime FROM empcred WHERE token = ?';
        const [results] = await connection.execute(query, [token]);
        connection.release();

        if (results.length === 0) {
            return res.status(401).send('Unauthorized - Token not found');
        }

        const { expiryTime  } = results[0];

        // Check if the token is still active
        if (new Date(expiryTime) < new Date()) {
            return res.status(401).send('Unauthorized - Token expired');
        }

        // Token is valid, continue with the API operation
        next();
    } catch (error) {
        console.error('Error authenticating token:', error);
        return res.status(500).send('Internal Server Error');
    }
};

// Apply token authentication middleware to all employee APIs
employeeAPIs.use(authenticateToken);



// Insert data into the "empdata" table
employeeAPIs.post("/", async (req, res) => {
    const empData = req.body;
    console.log(empData);

    // Generate a new UUID for the employee_id and convert it to a string
    const employee_id = uuidv4().toString();
    if (!empData.employee_name || !empData.designation || !empData.phone_number || !empData.email) {
        res.status(400).send("Missing required fields.");
        return;
    }

    try {
        const connection = await dbConnectionPool.getConnection();
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
employeeAPIs.get('/', async (req, res) => {
    try {
        const connection = await dbConnectionPool.getConnection();
        const query = 'SELECT employee_id, employee_name, designation, phone_number, email, joining_date, leaving_date, reporting_manager_id, address FROM empdata';
        const [results] = await connection.execute(query);
        connection.release(); // Release the connection back to the pool
        res.json(results);
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).send('An error occurred while fetching employee data.');
    }
});
// Define a route to update an employee's information
employeeAPIs.put('/:employee_id', async (req, res) => {
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

    try {
        const connection = await dbConnectionPool.getConnection();
        const query = `
            UPDATE empdata 
            SET employee_name = ?, designation = ?, phone_number = ?, email = ?, 
            joining_date = ?, leaving_date = ?, reporting_manager_id = ?, address = ?
            WHERE employee_id = ?
        `;
        const result = await connection.query(query, [
            employee_name,
            designation,
            phone_number,
            email,
            joining_date,
            leaving_date,
            reporting_manager_id,
            address,
            employeeId
        ]);

        connection.release(); // Release the connection back to the pool

        if (result[0].affectedRows > 0) {
            res.status(200).json({ message: 'Employee updated successfully' });
        } else {
            res.status(404).json({ error: 'Employee does not exist' });
        }
    } catch (error) {
        console.error('Error updating employee data: ' + error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// app.use('/api/v1/employees', employeeAPIs);
// app.use('/api/v1/timesheet', require('./timesheet.js'));



module.exports=employeeAPIs;
