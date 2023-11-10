const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const mysql = require('mysql2');
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



app.get('/employees/:employeeId/timesheet/month/:yearAndMonth', (req, res) => {
    const employeeId = req.params.employeeId;
    const yearAndMonth = req.params.yearAndMonth;
  
    // Check for an invalid month in the request parameters
    if (!isValidYearAndMonth(yearAndMonth)) {
      res.status(400).json({ error: 'Invalid month' });
      return;
    }
  
    // Extract year and month from the parameter
    const [year, month] = yearAndMonth.split('-');
  
    // Query the database to fetch timesheet data
    connection.query(
      'SELECT * FROM emptimesheet WHERE employee_id = ? AND YEAR(date) = ? AND MONTH(date) = ?',
      [employeeId, year, month],
      (err, results) => {
        if (err) {
          console.error('Error fetching timesheet: ', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
  
        if (results.length === 0) {
            // Check if the month is valid but not present in the database
            const isValidMonth = isValidYearAndMonth(yearAndMonth);
            if (isValidMonth) {
                res.status(404).json({ error: 'No timesheet entries for the specified month' });
            } else {
                res.status(400).json({ error: 'Invalid month' });
            }
          //res.status(404).json({ error: 'Employee does not exist' });
        } else {
          res.json(results);
        }
      }
    );
});

// Function to validate the yearAndMonth parameter
function isValidYearAndMonth(yearAndMonth) {
   
    const regex = /^\d{4}-\d{2}$/;
    return regex.test(yearAndMonth);
}

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
