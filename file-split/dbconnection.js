const mysql = require('mysql2');
const connection = mysql.createConnection({
  user: 'root',
  host: '127.0.0.1',
  database: 'emptime',
  password: 'password@123',
  port: 3307,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + connection.threadId);
});

module.exports = connection;