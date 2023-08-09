const express =require("express");
const app = express();
const port = 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
let timeesheet =[{
    EmpName:"Devi",
    Month:"august",
    Date:"08-08-2023",
    Workinghours:"8",
    leavehours:"0", 
    holidayhours:"0",  
},
{
    EmpName:"Ajeesh",
    Month:"August",
    Date:"08-08-2023",
    Workinghours:"8",
    leavehours:"0",
    holidayhours:"0",
},
];
//get list
app.get("/timeesheet" ,(req, res) =>{
    res.json(timeesheet);
} );

//insert
app.post("/timeesheet" ,(req, res) => {
    var timeesheet1=req.body;
    console.log(timeesheet1) ;
    timeesheet.push(timeesheet1);
    res.send("entry inserted");
});
/*
// Endpoint to update an employee by ID
app.put('/timeesheet/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedtimeesheet = req.body;
  
    timeesheet = timeesheet.map(timeesheet => {
      if (timeesheet.id === id) {
        return { ...timeesheet, ...updatedtimeesheet };
      }
      return timeesheet;
    });
  
    res.json({ message: 'Employee updated successfully' });
  });*/

//lsten port
app.listen(port, () => console.log(`server listenng at the port ${port}`));