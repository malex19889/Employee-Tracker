const mysql = require("mysql");
const inquirer = require("inquirer");
require("dotenv").config();

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
        inquirer.prompt(employeeAdd).then(function (data) {
          createEmployee(data);
          init();
        });
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
  connection.query(
    "INSERT INTO employee SET ?",
    // table elems
    {
      id: data.id,
      first_name: data.firstName,
      last_name: data.lastName,
      role_id: data.roleId,
      manager_id: data.managerId,
    },
    function (err, res) {
      if (err) console.log(err);
      console.log(res);
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

const viewOptions = [
  {
    type: "list",
    name: "update",
    message: "What employee would you like to update?",
    choices: ["departments", "employees", "roles","Return to main"],
  },
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
    type: "input",
    name: "roleId",
    message: "Please enter employees role id",
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
