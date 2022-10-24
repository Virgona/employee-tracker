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

            case 'Update Employee':
                updateEmployee();
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

        const roles = [];
        rows.forEach(row => roles.push(row.title))
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
                choices: roles,
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who is Thier Manager?',
                choices: ['manager 1', 'manager 2', 'manager 3']
            }
        ]).then((answers) => {
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (?,?,?,?)`;

            let roleId = null;
            for (key in arr) {
                if (rows[key].title === answers.role) {
                    roleId = parseInt(key) + 1
                }
            }
            console.log(roleId)

            console.log(arr);

            const param = [answers.first, answers.last, roleId, 1];

            db.query(sql, param, (err, rows) => {
                if (err) console.log(err);
                console.log('role added successfully')
                console.table(answers)
                promptCommands();
            });
        });
    });
}

function updateEmployee() {
    // let arr;
    // let employeeSelection;
    // let roleSelection;

    db.promise().query(`SELECT * FROM employee`)
        .then(([rows]) => {
            console.log(rows)
            const employees = [];
            rows.forEach(row => employees.push({ name: row.first_name + ' ' + row.last_name, value: row.id }))
            console.log(employees);
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
                        rows.forEach(row => roles.push({ name: row.title, value: row.id }));
                        console.log(roles);
                        inquirer.prompt([
                            {
                                type: "list",
                                name: "roleTitle",
                                message: "Which role do you want to assign the selected employee?",
                                choices: roles
                            }
                        ]).then(data => {
                            db.promise().query(`UPDATE employee SET role_id = ? WHERE id = ?`, [data.roleTitle, answers.employee])
                        })
                    })
            })
        })

    console.log('employee successfully updated!');
    promptCommands();
    // })
}
// db.query('SELECT * FROM role', (err, rows) => {
//     if (err) { throw err };
//     const arr = rows.map(role => role.id);

//     let roles = [];
//     rows.forEach(row => roles.push(row.title));
//     let roleSelection = inquirer.prompt([
//         {
//             name: 'role',
//             type: 'list',
//             choices: roles,
//             message: 'Select role to update employee with'
//         }
//     ]);
// });

// let roleId = null;
// for (key in arr) {
//     if (rows[key].title === answers.role) {
//         roleId = parseInt(key) + 1
//     }
// }
// sql = db.query("UPDATE employee SET ? WHERE ?", [{ role_id: roleSelection.role }, { id: employeeSelection.employee }]);


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