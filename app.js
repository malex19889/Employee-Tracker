const Employee = require("./Develop/lib/employee");
const Role = require("./Develop/lib/role");
const Department = require("./Develop/lib/department");
const mysql = require("mysql");
const inquirer = require("inquirer");
require("dotenv").config();

const startOptions = [
  {
    type: "list",
    name: "options",
    message: "What would you like to do",
    choices: ["Add Department", "Add Role", "Add Employee", "Done"],
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
  }
];

const roleAdd = [
  {
    type: "input",
    name: "id",
    message: "Please enter the deparment id",
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
  }
];

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
    await inquirer.prompt(startOptions).then(function (data) {
      console.log(data);
      switch (data.options) {
        case "Add Department":
          console.log("adding department");
          inquirer.prompt().then(function (data) {
            console.log(data);
            createDepartment(data);
            init();
          });
          break;

        case "Add Role":
          console.log("adding role");
          inquirer.prompt(roleAdd).then(function (data) {
            console.log(data);
            createRole(data);
            init();
          });
          break;

        case "Add Employee":
          console.log("adding employee");
          inquirer.prompt(employeeAdd).then(function (data) {
            console.log(data);
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
  } catch (err) {
    if (err) throw err;
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
    }
  );
}
