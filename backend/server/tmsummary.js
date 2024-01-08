 const express = require('./parent.js');
const { authenticateToken } = require('./tokenValidation');
const dbConnectionPool = require('./db.js');

const tmsummary = express.Router();

// Apply the authentication middleware to all API routes
tmsummary.use(authenticateToken);

// API to get total time worked and total leaves for a specific employee, year, and month
tmsummary.post('/totals', async (req, res) => {
  try {
    const { employeeId, year, month } = req.body;

    // Validate input parameters
    if (!employeeId || !year || !month) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }

    // Convert month from word to number (assuming you have a mapping from words to numbers)
    const monthNumber = convertMonthToNumber(month);

    if (!monthNumber) {
      return res.status(400).json({ error: 'Invalid month' });
    }

    // Get total time worked
    const totalTimeQuery = `SELECT SUM(working_hours) as total_time_worked FROM emptimesheet WHERE employee_id = ? AND YEAR(date) = ? AND MONTH(date) = ?`;
    const [totalTimeResult] = await dbConnectionPool.query(totalTimeQuery, [employeeId, year, monthNumber]);
    const totalTimeWorked = totalTimeResult[0].total_time_worked || 0;

    // Get total leaves count
    const totalLeavesQuery = `SELECT COUNT(*) as total_leaves FROM emptimesheet WHERE employee_id = ? AND YEAR(date) = ? AND MONTH(date) = ? AND leaves IS NOT NULL`;
    const [totalLeavesResult] = await dbConnectionPool.query(totalLeavesQuery, [employeeId, year, monthNumber]);
    const totalLeaves = totalLeavesResult[0].total_leaves || 0;

    res.json({ total_time_worked: totalTimeWorked, total_leaves: totalLeaves });
  } catch (error) {
    console.error('Error fetching totals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to convert month from word to number (you might need to extend this based on your requirements)
function convertMonthToNumber(monthWord) {
  const monthMap = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };

  return monthMap[monthWord.toLowerCase()];
}

module.exports = tmsummary;
