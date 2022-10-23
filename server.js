const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const employeeClass = require('./classes/Employee')

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
                'Add Department',
                'Add Employee',
                'Add Role',
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

            case 'Add Employee':
                addEmployee()
                break;

            case 'Add Department':
                addDepartment();
                break;

            case 'Add Role':
                addRole();

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
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'dep',
            message: "What is the name of the new Department?"
        }
    ]).then((answers) => {
        console.log(answers);
        const sql = `INSERT INTO department (name)
            VALUES (?)`;
        const params = answers.dep;
        db.query(sql, params, (err, rows) => {
            console.log('department successfully added')
            promptCommands()
        })
    })
}

function addRole() {
    const sql = `SELECT * FROM department`;

    db.query(sql, (err, rows) => {

        const arr = rows.map(department => department.id);

        return inquirer.prompt([
            {
                name: 'title',
                message: 'What is the title of this role?',
            },
            {
                name: 'salary',
                message: 'What is the wage of this role?'
            },
            {
                type: 'list',
                name: 'choice',
                message: 'Which department does this role belong?',
                choices: rows
            },
        ]).then(answers => {
            const sql = `INSERT INTO role (title, salary, department_id)
            VALUES (?,?,?)`;
            console.log(answers.choice);
            let departmentId = null;
            for (key in arr) {
                if (rows[key].name === answers.choice) {
                    departmentId = parseInt(key) + 1
                }
            }
            const param = [answers.title, answers.salary, departmentId];
            console.log(param);
            db.query(sql, param, (err, rows) => {
                if (err) console.log(err);
                console.log('role added successfully')
                console.table(answers)
                promptCommands();
            });
        });
    });
};
function addEmployee() {

    const sql = `SELECT * FROM role`;

    db.query(sql, (err, rows) => {

        const arr = rows.map(role => role.id);

        return inquirer.prompt([
            {
                type: 'input',
                name: 'first',
                message: "What is the new employee's first name?"
            },
            {
                type: 'input',
                name: 'last',
                message: "What is the new employee's last name?"
            },
            {
                type: 'list',
                name: 'role',
                message: "What is the new employee's role?",
                choices: rows,
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who is Thier Manager?',
                choices: ['manager 1', 'manager 2', 'manager 3']
            }
        ]).then((answers) => {
            const sql = `INSERT INTO employee (first_name, last_name, role_id)
            VALUES (?,?,?)`;

            let roleId = null;
            for (key in arr) {
                if (rows[key].name === answers.choice) {
                    roleId = parseInt(key) + 1
                }
            }
            const param = [answers.first_name, answers.last_name, roleId];

            db.query(sql, param, (err, rows) => {
                if (err) console.log(err);
                console.log('role added successfully')
                console.table(answers)
                promptCommands();
            });
        });
    });
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