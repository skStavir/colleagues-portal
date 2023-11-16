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



app.get('/employees/:reporting_manager_id/subordinates/timesheet/month/:yearAndMonth', (req, res) => {
  const { reporting_manager_id, yearAndMonth } = req.params;

  //console.log('Reporting Manager ID:', reporting_manager_id);
 // console.log('Year and Month:', yearAndMonth);

  // Validate manager exists
  const validateManagerQuery = 'SELECT * FROM empdata WHERE BINARY employee_id = ?';
  connection.query(validateManagerQuery, [reporting_manager_id], (err, managerResult) => {
    if (err) {
      console.error('Error validating manager:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    //console.log('Manager Result:', managerResult);

    if (managerResult.length === 0) {
      // Manager does not exist
      res.status(404).json({ error: 'Employee does not exist' });
      return;
    }

    // Validate month format
    function isValidYearAndMonth(yearAndMonth) {
      const regex = /^\d{4}-\d{2}$/;
      return regex.test(yearAndMonth);
    }

    if (!isValidYearAndMonth(yearAndMonth)) {
      res.status(400).json({ error: 'Invalid year and month format' });
      return;
    }

    // Extract year and month from yearAndMonth parameter
    const year = yearAndMonth.substring(0, 4);
    const month = yearAndMonth.substring(5, 7);

    // Fetch timesheet entries using JOIN query
    const fetchTimesheetQuery = `
      SELECT t.timesheet_id, t.date, t.working_hours, t.leaves, t.holiday, t.employee_id
      FROM emptimesheet t
      JOIN empdata e ON t.employee_id = e.employee_id
      WHERE YEAR(t.date) = ? AND MONTH(t.date) = ?
      AND e.reporting_manager_id = ?
      ORDER BY t.employee_id,t.date;
    `;

    connection.query(fetchTimesheetQuery, [year, month, reporting_manager_id], (err, timesheetResult) => {
      if (err) {
        console.error('Error fetching timesheet:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // Check if there are entries for the specified month
      if (timesheetResult.length === 0) {
        res.status(404).json({ error: 'No timesheet entries found for the specified month' });
        return;
      }

      // Return timesheet details
      res.json(timesheetResult);
    });
  });
});




// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
