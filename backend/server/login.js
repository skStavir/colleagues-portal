const { v4: uuidv4 } = require('uuid');
const express = require('./parent.js');
const dbConnectionPool = require('./db.js');
const loginAPIs = express.Router();


loginAPIs.post('/', async (req, res) => {
  //1. get user password (refer get employee API)
  //1.1 create connection
  //1.2 query db using connection
  //1.3 get data
  //2. validate if the password is correct (refer exisitng code)
  //3. if invalid password throw error(refer exisitng code)
  //4. create token (refer exisitng code)
  //5. save token to db (reder post employee API)
  //5.1 create connection
  //5.2 execute query
  //end

});
// Login API endpoint - old code for reference, delete once the new code is working.
loginAPIs.post('/oldcodeforrefernce', async (req, res) => {
  console.log("loginAPI");
  const { username, password } = req.body;
  console.log("req body");
  const connection =  dbConnectionPool.getConnection();
  console.log("connection" + connection);
  const query = {
    text: 'SELECT * FROM empcred WHERE username = ?',
    values: [
      username
    ],
};
  const results = await connection.query('SELECT * FROM empcred WHERE username = ?', [username]);
  console.log("results" + results);
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

// Handling invalid request payload
loginAPIs.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid request payload' });
  }
  next();
});

module.exports = loginAPIs;
