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
// function to start application
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
                'Update Employee',
                'Add Role',
                'QUIT'
            ]
        }
    ).then(function (response) {
        console.log(response.command);

        switch (response.command) {
            case 'View all Employees':
                getEmployees();
                break;

            case 'View all Roles':
                getRoles();
                break;

            case 'View all Departments':
                getDepartments();
                break;

            case 'Add Employee':
                addEmployee();
                break;

            case 'Update Employee':
                updateEmployee();
                break;

            case 'Add Department':
                addDepartment();
                break;

            case 'Add Role':
                addRole();
                break;

            case 'QUIT':
                process.exit();
            default:
                break;
        };

    })
    // function to add departments to database
}
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'dep',
            message: "What is the name of the new Department?"
        }
    ]).then((answers) => {
        const sql = `INSERT INTO department (name)
            VALUES (?)`;
        const params = answers.dep;
        db.query(sql, params, (err, rows) => {
            console.log('department successfully added')
            promptCommands();
        })
    })
}
// function to add a role to database
function addRole() {
    const sql = `SELECT * FROM department`;

    db.query(sql, (err, rows) => {

        const arr = rows.map(department => department.id);

        inquirer.prompt([
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
            let departmentId = null;
            for (key in arr) {
                if (rows[key].name === answers.choice) {
                    departmentId = parseInt(key) + 1
                }
            }
            const param = [answers.title, answers.salary, departmentId];
            db.query(sql, param, (err, rows) => {
                if (err) console.log(err);
                console.log('role added successfully')
                console.table(getRoles())
                promptCommands();
            });
        });
    });
};
// function to add an employee to database
function addEmployee() {

    const sql = `SELECT * FROM role`;

    db.query(sql, (err, rows) => {

        const roles = [];
        rows.forEach(row => roles.push(row))

        inquirer.prompt([
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
                choices: roles.map(role => ({ name: role.title, value: role.id })),
            }]).then(
                (answers) => {
                    db.promise().query('SELECT * FROM employee').then(
                        ([rows]) => {
                            const managerChoices = rows.map(({ id, first_name, last_name }) => (
                                {
                                    name: `${first_name} ${last_name}`,
                                    value: id
                                }
                            ))
                            inquirer.prompt({
                                type: 'list',
                                name: 'managerId',
                                message: 'Who is the manager?',
                                choices: managerChoices
                            }).then((manager) => {
                                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                            VALUES (?,?,?,?)`;

                                const param = [answers.first, answers.last, answers.role, manager.managerId];

                                db.query(sql, param, (err, rows) => {
                                    if (err) console.log(err);
                                    console.log('employee added successfully')
                                    console.table(getEmployees())
                                    promptCommands();
                                });
                            });
                        });
                })
    })
}
// function to update an existing employee in the database
function updateEmployee() {

    db.promise().query(`SELECT * FROM employee`)
        .then(([rows]) => {
            console.log(rows)
            const employees = [];
            rows.forEach(row => employees.push({ name: row.first_name + ' ' + row.last_name, value: row.id }))
            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'list',
                    choices: employees,
                    message: 'Which employee would you like to update?'
                }
            ]).then(answers => {
                db.promise().query(`SELECT * FROM role`)
                    .then(([rows]) => {
                        const roles = [];
                        rows.forEach(row => roles.push({ name: row.title, value: row.id }))
                        inquirer.prompt([
                            {
                                type: "list",
                                name: "roleTitle",
                                message: "Which role do you want to assign the selected employee?",
                                choices: roles
                            }
                        ]).then(data => {
                            db.promise().query(`UPDATE employee SET role_id = ? WHERE id = ?`, [data.roleTitle, answers.employee]).then(
                                () => {
                                    console.log('employee successfully updated!');
                                    promptCommands();
                                }
                            )
                        })
                    })
            })
        })

}

// functions below get employees, roles and departments and displays them
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
        promptCommands();
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
        promptCommands();
    });
}
// starts CLI
promptCommands()