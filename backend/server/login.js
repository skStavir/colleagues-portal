const { v4: uuidv4 } = require('uuid');
const express = require('./parent.js');
const dbConnectionPool = require('./db.js');
const loginAPIs = express.Router();

// Login API endpoint
loginAPIs.post('/', (req, res) => {
  console.log("loginAPI");
  const { username, password } = req.body;

  dbConnectionPool.getConnection((err, connection) => { 
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if the username exists in the database
    connection.query('SELECT * FROM empcred WHERE username = ?', [username], (err, results) => {
      //connection.release();

      if (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      console.log('Results from SELECT query:', results);

      if (results.length === 0) {
        return res.status(404).json({ error: 'Username not found' });
      }

      const user = results[0];

      // Check if the password matches
      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Generate a new token
      const newToken = uuidv4();

      // Update the database with the new token and expiry time
      connection.query(
        'UPDATE empcred SET token = ?, expiryTime = NOW() + INTERVAL 1 HOUR WHERE username = ?',
        [newToken, username],
        (err, updateResults) => {
          if (err) {
            console.error('Error updating token:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }

          // If the update is successful, return the token
          if (updateResults.affectedRows > 0) {
            return res.status(200).json({ token: newToken });
          } else {
            return res.status(500).json({ error: 'Internal server error' });
          }
        }
      );
    });
  });
});

// Handling invalid request payload
loginAPIs.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid request payload' });
  }
  next();
});

module.exports = loginAPIs;
