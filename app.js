const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
require("dotenv").config();

const managersArr = [];
const rolesArr = [];
const employeesArr = [];
const deptsArr = [];

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.MYSQLPW,
  database: "employeetracker",
});
//   connect to sql db
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  updateArrs();
   init();
   
});

async function init() {
  try {
    inquirer.prompt(startOptions).then(function (data) {
    switch (data.options) {
      case "Add Department":
        console.log("adding department");
        inquirer.prompt(departmentAdd).then(function (data) {
          createDepartment(data);
        });
        break;

      case "Add Role":
        console.log("adding role");
        inquirer.prompt(roleAdd).then(function (data) {
          createRole(data);
        });
         
        break;

      case "Add Employee":
        console.log("adding employee");
        inquirer.prompt(employeeAdd).then(function (data) {
          createEmployee(data);
        });
        break;

      case "View Database":
        viewDB();
        break;

      case "View roles":
        console.log("adding role");
        inquirer.prompt(roleAdd).then(function (data) {
          createRole(data);
          init();
        });
        break;

      case "View employees":
        console.log("adding employee");
        inquirer.prompt(employeeAdd).then(function (data) {
          createEmployee(data);
          init();
        });
        break;

      case "Update employee":
        console.log("adding employee");
          updateEmployee();
        break;

      default:
        // close sql connection
        connection.end();
        break;
    }
  });
  } catch (error) {
    if (error) throw error;
  }
  
}

function createEmployee(data) {
  empRoleId = parseInt(data.roleId)
  connection.query(
    "INSERT INTO employee SET ?",
    // table elems
    {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      roleId: empRoleId,
      managerId: data.managerId,
    },
    function (err, res) {
      if (err) console.log(err);
      console.table(res);
      init();
    }
  );
}

function createDepartment(data) {
  connection.query(
    "INSERT INTO department SET ?",
    // table elems
    {
      id: data.id,
      name: data.name,
    },
    function (err, res) {
      if (err) console.log(err);
      console.log(res);
       init();
    }
  );
}

function createRole(data) {
  connection.query(
    "INSERT INTO role SET ?",
    // table elems
    {
      id: data.id,
      title: data.title,
      salary: data.salary,
      department_id: data.departmentId,
    },
    function (err, res) {
      if (err) console.log(err);
      console.log(res);
       init();
    }
  );
}

async function viewDB() {
  try {
    inquirer.prompt(viewOptions).then(function (data) {
       switch (data.view) {
    case "departments":
      connection.query("SELECT * FROM department", function (err, res) {
        if (err) console.log(err);
        console.table(res);
        init();
      });
      break;  

    case "employees":
      connection.query("SELECT * FROM employee", function (err, res) {
        if (err) console.log(err);
        console.table(res);
        init();
      });
      break;

    case "roles":
      connection.query("SELECT * FROM role", function (err, res) {
        if (err) console.log(err);
        console.table(res);
          init();
        
      });
      break;

    default:
       init();
      break;
  }
    });
    
  } catch (err) {
    if (err) throw error;
  }
 
}

function updateEmployee() {
  inquirer.prompt(employeeUpdate).then(function (data) {
    let empId = parseInt(data.update);
    let newRole = parseInt(data.dpt) ;
   connection.query("UPDATE employee SET ? WHERE id =?",
   [
     {
       roleId: newRole
     },
     empId
   ], function (err, res) {
     if (err) console.log(err);
     init();
   }); 
  console.log("Updating ....\n");
  }
  )}

async function updateArrs(){
  try {
   await connection.query("SELECT id, firstName, lastName FROM employee", function (err, res) {
    if (err) console.log(err);
    for (let i=0; i < res.length; i++){
      employeesArr.push(res[i].id+" "+res[i].firstName+" "+res[i].lastName);
  }
    //  console.log(employeesArr)
  }); 
   await connection.query("SELECT * FROM department", function (err, res) {
    if (err) console.log(err);
    for (let i=0; i < res.length; i++){
      deptsArr.push(res[i]);
  }
  });
  
 await connection.query("SELECT * FROM role", function (err, res) {
    if (err) console.log(err);
    for (let i=0; i < res.length; i++){
      rolesArr.push(res[i].id+" "+res[i].title);
  }
  // console.log(deptsArr)
 
  });
  } catch (err) {
    if(err) throw err;
  }
 
}

// all inquirer prompts
const startOptions = [
  {
    type: "list",
    name: "options",
    message: "What would you like to do",
    choices: [
      "Add Department",
      "Add Role",
      "Add Employee",
      "View Database",
      "View roles",
      "View employees",
      "Update employee",
      "Done",
    ],
  },
];

const viewOptions = [
  {
    type: "list",
    name: "view",
    message: "What would you like to view",
    choices: ["departments", "employees", "roles","Return to main"],
  },
];

const employeeUpdate = [
  {
    type: "list",
    name: "update",
    message: "What employee would you like to update?",
    choices: employeesArr
  },
  {
    type: "list",
    name: "dpt",
    message: "What role do you want to transfer to?",
    choices: rolesArr
  }
];

const employeeAdd = [
  {
    type: "input",
    name: "id",
    message: "Please enter employee id",
  },
  {
    type: "input",
    name: "firstName",
    message: "Please enter employees first name",
  },
  {
    type: "input",
    name: "lastName",
    message: "Please enter employees last name",
  },
  {
    type: "list",
    name: "roleId",
    message: "Please chose a role",
    choices: rolesArr
  },
  {
    type: "input",
    name: "managerId",
    message: "Please enter employees manager id",
  },
];

const departmentAdd = [
  {
    type: "input",
    name: "id",
    message: "Please enter a department id",
  },
  {
    type: "input",
    name: "name",
    message: "Please enter the department name",
  },
];

const roleAdd = [
  {
    type: "input",
    name: "id",
    message: "Please enter the role id",
  },
  {
    type: "input",
    name: "title",
    message: "Please enter a role name",
  },
  {
    type: "number",
    name: "salary",
    message: "Please enter salary amount",
  },
  {
    type: "input",
    name: "departmentId",
    message: "Please enter the department id for this role",
  },
];
