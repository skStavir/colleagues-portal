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

module.exports = dbConnectionPool;