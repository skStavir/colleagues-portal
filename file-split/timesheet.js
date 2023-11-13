const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const dbconnection = require('./dbconnection');

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

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
