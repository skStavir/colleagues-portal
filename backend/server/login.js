const { v4: uuidv4 } = require('uuid');
const express = require('./parent.js');
const dbConnectionPool = require('./db.js');
const loginAPIs = express.Router();

// Function to update the token in the database
async function updateTokenInDatabase(username, newToken) {
  try {
    const connection = await dbConnectionPool.getConnection();
    const updateQuery = {
      text: 'UPDATE empcred SET token = ?, expiryTime = NOW() + INTERVAL 1 HOUR WHERE username = ?',
      values: [newToken, username],
    };
    const [updateResults] = await connection.execute(updateQuery.text, updateQuery.values);
    connection.release();

    return updateResults.affectedRows > 0;
  } catch (error) {
    console.error('Error updating token in the database:', error);
    return false;
  }
}

loginAPIs.post('/', async (req, res) => {
  try {
    // 1. Get user password
    const { username, password } = req.body;
    const connection = await dbConnectionPool.getConnection();

    // 1.1 Create connection
    // 1.2 Query db using connection
    // 1.3 Get data
    const query = {
      text: 'SELECT * FROM empcred WHERE username = ?',
      values: [username],
    };

    const [results] = await connection.execute(query.text, query.values);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Username not found' });
    }

    const user = results[0];

    // 2. Validate if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // 3. If invalid password, throw error (refer existing code)

    // 4. Create token (refer existing code)
    const newToken = uuidv4();

    // 5. Save token to db
    const updateSuccess = await updateTokenInDatabase(username, newToken);

    if (updateSuccess) {
      return res.status(200).json({ token: newToken });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Handling invalid request payload
loginAPIs.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid request payload' });
  }
  next();
});

module.exports = loginAPIs;
