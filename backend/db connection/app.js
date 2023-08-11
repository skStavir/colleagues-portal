const http = require('http');
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'humaneoroot',
    password: 'root@2503',
    database: 'your_database'
});

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    // Fetch data from the database
    connection.query('SELECT * FROM humaneoemployees', (err, results) => {
        if (err) {
            throw err;
        }
        
        // Create HTML table
        let tableHtml = '<table><tr><th>emp_id</th><th>emp_name</th><th>Designation</th><th>ReportingManger</th><th>Joining date</th><th>Email</th><th>Action</th></tr>';
        results.forEach(row => {
            tableHtml += `<tr><td>${row.id}</td><td>${row.name}</td><td>${row.designation}</td><td>${row.repmanager}</td><td>${row.joindate}</td><td>${row.email}</td><td>${row.action}</td></tr>`;
        });
        tableHtml += '</table>';
        
        // Send the HTML response
        const html = `
            <!DOCTYPE html>
            <html>
            <head><title>MySQL Data Display</title></head>
            <body>${tableHtml}</body>
            </html>`;
        
        res.end(html);
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
