const express = require('./parent.js')
var app = module.exports = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const port = 3000;

app.use('/api/v1/employees', require('./employee.js'));
app.use('/api/v1/timesheet', require('./timesheet.js'));
// Listen on the specified port
app.listen(port, () => console.log(`Server listening at the port ${port}`));
