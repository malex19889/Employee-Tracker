const mysql = require("mysql");
const inquirer = require("inquirer")
require("dotenv").config();


var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: process.env.MYSQLPW,
    database: "employeetracker"
  });
//   connect to sql db 
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
//    close sql connection
    connection.end();
  });
