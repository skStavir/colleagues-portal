const { v4: uuidv4 } = require('uuid');
var dbConnectionPool = require('./db.js');
const express = require('./parent.js')
var timesheetAPIs = express.Router();

//Timesheet APIS
// Create a POST route for adding timesheet data
timesheetAPIs.post('/', async (req, res) => {
    const { timesheet_id, employee_id, date, working_hours, leaves, holiday } = req.body;

    if (!timesheet_id || !employee_id || !date || working_hours === undefined || leaves === undefined || holiday === undefined) {
        res.status(400).json({ error: "Invalid request payload" });
        return;
    }

    const insertOrUpdateQuery = `
        INSERT INTO emptimesheet (timesheet_id, employee_id, date, working_hours, leaves, holiday)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        employee_id = VALUES(employee_id),
        date = VALUES(date),
        working_hours = VALUES(working_hours),
        leaves = VALUES(leaves),
        holiday = VALUES(holiday)
    `;

    try {
        const connection = await dbConnectionPool.getConnection();
        const [results] = await connection.execute(insertOrUpdateQuery, [timesheet_id, employee_id, date, working_hours, leaves, holiday]);

        if (results.affectedRows > 0) {
            res.status(201).json({ message: "Timesheet added" });
        } else {
            res.status(500).json({ error: "Failed to add or update timesheet" });
        }

        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.error("Database error: " + err.message);
        res.status(500).json({ error: "Database error: " + err.message });
    }
});

//FETCH TIMESHEET BASED ON EMPLOYEE ID
// Function to validate the yearAndMonth parameter
function isValidYearAndMonth(yearAndMonth) {
    const regex = /^\d{4}-\d{2}$/;
    return regex.test(yearAndMonth);
}

timesheetAPIs.get('/employees/:employeeId/month/:yearAndMonth', async (req, res) => {
    const employeeId = req.params.employeeId;
    const yearAndMonth = req.params.yearAndMonth;

    // Check for an invalid month in the request parameters
    if (!isValidYearAndMonth(yearAndMonth)) {
        res.status(400).json({ error: 'Invalid month' });
        return;
    }

    // Extract year and month from the parameter
    const [year, month] = yearAndMonth.split('-');

    try {
        const connection = await dbConnectionPool.getConnection();

        // Query the database to fetch timesheet data
        const query = `
            SELECT * FROM emptimesheet
            WHERE employee_id = ? AND YEAR(date) = ? AND MONTH(date) = ?
        `;

        const [results] = await connection.execute(query, [employeeId, year, month]);

        if (results.length === 0) {
            // Check if the month is valid but not present in the database
            const isValidMonth = isValidYearAndMonth(yearAndMonth);
            if (isValidMonth) {
                res.status(404).json({ error: 'No timesheet entries for the specified month' });
            } else {
                res.status(400).json({ error: 'Invalid month' });
            }
        } else {
            res.json(results);
        }

        connection.release(); // Release the connection back to the pool
    } catch (error) {
        console.error('Error fetching timesheet:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



//FETCH TIMESHEET BASED ON REPORTING MANAGER ID
timesheetAPIs.get('/employees/:reporting_manager_id/subordinates/month/:yearAndMonth', async (req, res) => {
    const { reporting_manager_id, yearAndMonth } = req.params;

    try {
        // Acquire a connection from the pool
        const connection = await dbConnectionPool.getConnection();

        // Validate manager exists
        const validateManagerQuery = 'SELECT * FROM empdata WHERE BINARY employee_id = ?';
        connection.query(validateManagerQuery, [reporting_manager_id], (err, managerResult) => {
            if (err) {
                console.error('Error validating manager:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

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
                ORDER BY t.employee_id, t.date;
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

            // Release the connection back to the pool
            connection.release();
        });
    } catch (error) {
        console.error('Error acquiring database connection:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports=timesheetAPIs;


