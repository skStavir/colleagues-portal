const mysql = require('mysql2/promise'); // Use the promise-based version of mysql2
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('config/app.properties');

// Create a connection pool
const dbConnectionPool = mysql.createPool({
    user: properties.get("db.user"),
    host: properties.get("db.server"),
    database: properties.get("db.name"),
    password: properties.get("db.password"),
    port: properties.get("db.port"),
    connectionLimit: properties.get("db.connectionLimit"), // Adjust the connection limit as needed

});
dbConnectionPool.getConnection()
    .then(connection => {
        console.log('Connected to the database!');
        connection.release();
    })
    .catch(error => {
        console.error('Error connecting to the database:', error);
        // Handle the error appropriately, for example, exit the application or log an error message.
    });
module.exports = dbConnectionPool;