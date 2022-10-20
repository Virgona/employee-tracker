const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',

        user: 'root',

        password: 'Abc123',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

function promptCommands() {
    inquirer.prompt(
        {
            type: 'list',
            name: 'command',
            message: 'What do you want to do?',
            choices: [
                'View all Employees',
                'View all Departments',
                'View all Roles',
                'QUIT'
            ]
        }
    ).then(function (response) {
        console.log(response.command);

        switch (response.command) {
            case 'View all Employees':
                getEmployees()
                break;

            case 'View all Roles':
                getRoles()
                break;

            case 'View all Departments':
                getDepartments()
                break;
            default:
                break;
        };

        // if they chose a diff command
        // -- do that
        // -- ask again

    })

    // ask user for command
    // then
    // -- query the db for that command
    // -- display it on the screen
    // -- ask user for command
    // -- then
    // -- -- 
}

function addEmployee() {
    // query the roles table for role name and id
    // take the array of role object and transform (map) them into and array of choice objects
    // [{ id: 2, title: 'front end dev', salary: 50, department_id: 1}] turn this 
    // [{ name: 'front end dev', value: 2 }] into this
    // that array of objects gets passed into lists

    inquirer.prompt([
        // ask their first name
        // ask their last name
        // ask ther role (list)
        // ask ther manager (lists)
    ]).then(() => {
        // db.query to insert a row
    })
}

function getEmployees() {
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(data)
        promptCommands()
    });
}
function getRoles() {
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(data)
        promptCommands()
    });
}
function getDepartments() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(data)
        promptCommands()
    });
}

promptCommands()