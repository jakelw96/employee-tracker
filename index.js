const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

// Connect to database
db.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
});

const employeeArr = [];
const roleArr = [];
const departmentArr = [];

// Initial options at start of application
const initialPrompt = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'prompt',
            message: "What would you like to do?",
            choices: [
              'View All Departments', 
              'View All Roles', 
              'View All Employees', 
              'Add A Department', 
              'Add A Role', 
              'Add An Employee', 
              'Update An Employee Role',
              'Exit'
            ]
        }
    ])
    .then(response => {
        const answer = (response.prompt).toString();

        if (answer === 'View All Employees') {
            viewAllEmployees();
        } else if (answer === 'View All Departments') {
             viewAllDepartments();
        } else if (answer === 'View All Roles') {
             viewAllRoles();
        } else if (answer === 'Add A Department') {
             addDepartment()
        } else if (answer === 'Add A Role') {
             addRole()
        } else if (answer === 'Add An Employee') {
            // addEmployee()
        } else if (answer === 'Update An Employee Role') {
            // updateRole()
        } else if (answer === 'Exit') {
            db.end();
        }
    });
};

// Gets all employee data from database
const viewAllEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name,
                role.title AS title,
                department.name AS department, role.salary,
                CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                FROM employee
                LEFT JOIN (employee manager) ON manager.id = employee.manager_id
                LEFT JOIN role on employee.role_id = role.id
                LEFT JOIN department ON department.id = role.department_id;`

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(``);
        console.log(``);
        console.log(`                                   ` + 'All Employees');
        console.log(`=============================================================================================`)
        console.table(result);
        console.log(`=============================================================================================`)
        initialPrompt();
    });
};

// Gets all department data from database
const viewAllDepartments = () => {
    const sql = `SELECT * FROM department;`

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(``);
        console.log(``);
        console.log(`                   ` + 'All Departments');
        console.log(`========================================================`)
        console.table(result);
        console.log(`========================================================`)
        initialPrompt();
    });
};

// Gets all role data from database
const viewAllRoles = () => {
    const sql = `SELECT role.id, role.title, role.salary, department.name AS department
                FROM role
                LEFT JOIN department ON department.id = role.department_id;`

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(``);
        console.log(`                     ` + 'All Roles');
        console.log(`========================================================`)
        console.table(result);
        console.log(`========================================================`);
        initialPrompt();
    });
};

// Adds new employee
const addEmployee = () => {

};

// Adds new department
const addDepartment = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: "Please enter name of new department. (Required)", 
            validate: deptInput => {
                if (deptInput) {
                    return true;
                } else {
                    console.log("  Please enter the new department's name.");
                    return false;
                }
            }
        },
    ])
    .then(response => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
         db.query(sql, response.addDept, (err, result) => {
             if (err) throw err;
             console.log('New department added successfully!')
             initialPrompt();
         })
    });
};

// Adds new role
const addRole = () => {
    const sql = `SELECT * FROM department;`

    db.query(sql, (err, roleData) => {
        if (err) throw error;
        roleData.forEach((department) => departmentArr.push(department.name));
        
        inquirer.prompt([
            {
                type: 'input',
                name: 'addRoleName',
                message: "Please enter the name of the new role.",
                validate: roleNameInput => {
                    if (roleNameInput) {
                        return true;
                    } else {
                        console.log("  Please enter the new role's name.");
                     return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'addRoleSalary',
                message: "Please enter the salary of the new role.",
                validate: roleSalaryInput => {
                    if (roleSalaryInput) {
                        if(isNaN(roleSalaryInput)) {
                            console.log("  Please enter a number for the salary.")
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        console.log("  Please enter the new role's salary.");
                        return false;
                    }
                } 
            },
            {
              type: 'list',
              name: 'addRoleDepartment',
              message: "Please select the department the role belongs to.",
              choices: departmentArr  
            }
        ])
        .then(response => {
            const responseDept = response.addRoleDepartment;
            const sql = `INSERT INTO role VALUES (?, ?, ?)`;
            const dept = `SELECT department.id
                            FROM department
                            WHERE name = ?`;
            
            const deptID = db.query(dept, responseDept, (err, result) => {
                if (err) throw err;
                return department.id;
            });
            console.log(deptID)

            // db.query(sql, response.addRoleName, response.addRoleSalary, , (err, results) => {
            //     if (err) throw err;
            //     console.log('New role added successfully!');
            //     initialPrompt();
            // })
        });
    });
};

// Updates employee role
const updateRole = () => {

};

initialPrompt();