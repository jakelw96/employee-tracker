const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

// Connect to database
db.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
});

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
              'View Employees By Manager',
              'View Employees By Department',
              'View Total Salary Cost by Department', 
              'Add A Department', 
              'Add A Role', 
              'Add An Employee', 
              'Update An Employee Role',
              'Update An Employees Manager',
              'Delete An Employee',
              'Delete A Role',
              'Delete A Department',
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
            addEmployee()
        } else if (answer === 'Update An Employee Role') {
            updateRole()
        } else if (answer === 'Delete An Employee') {
            deleteEmployee()
        } else if (answer === 'Delete A Role') {
            deleteRole()
        } else if (answer === 'Delete A Department') {
            deleteDepartment()
        } else if (answer === 'Update An Employees Manager') {
            updateManager()
        } else if (answer === 'View Employees By Manager') {
            viewEmployeesMgr()
        } else if (answer === 'View Employees By Department') {
            viewEmployeesDept()
        } else if (answer === 'View Total Salary Cost by Department') {
            salaryDept()
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

// Views employees by manager
const viewEmployeesMgr = () => {
    const mgrArr = [];
    
    // Query to get employees
    const sqlMgr = `SELECT * FROM employee;`;
    db.query(sqlMgr, (err, response) => {
        if (err) throw err;
        response.forEach((employee) => mgrArr.push(employee.first_name + ' ' + employee.last_name));
        inquirer.prompt([
            {
                type: 'list',
                name: 'mgrData',
                message: "Which manager would you like to see the employee's under?",
                choices: mgrArr
            }
        ])
        .then(result => {
            let firstName = (result.mgrData).split(' ')[0];
            let lastName = (result.mgrData).split(' ').pop();
            let mgrID;
            
            // Gets mgr id
            response.forEach((employee) => {
                if ((firstName === employee.first_name) && (lastName === employee.last_name)) {
                    mgrID = employee.id;
                }
            })

            // Query to view data
            const sql = `SELECT * FROM employee WHERE manager_id = ?;`;
            db.query(sql, mgrID, (err, result) =>{
                if (err) throw err;
                console.log(``);
                console.log(`                     ` + 'Employees By Manager');
                console.log(`========================================================`)
                console.table(result);
                console.log(`========================================================`);
                initialPrompt();
            })
        })
    });
};

// View employees by department
const viewEmployeesDept = () => {
    const deptArr = [];
    
    // Query to get departments
    const sqlDept = `SELECT * FROM department;`;
    db.query(sqlDept, (err, response) => {
        if (err) throw err;
        response.forEach((department) => deptArr.push(department.name));
        inquirer.prompt([
            {
                type: 'list',
                name: 'deptData',
                message: "Which department would you like to see the employee's under?",
                choices: deptArr
            }
        ])
        .then(result => {
            const roleArr = [];
            let deptID;
            
            // Gets department id
            response.forEach((department) => {
                if (result.deptData === department.name) {
                    deptID = department.id;
                }
            })

            // Query to get roles associate with department ID
            const sqlRole = `SELECT * FROM role WHERE department_id = ?;`;
            db.query(sqlRole, deptID, (err, responseRole) => {
                if (err) throw err;
                // Loops through roles and pushes ids to array
                responseRole.forEach((role) => roleArr.push(role.id));

                // Query to get employees associate with the roles and display in table
                const sqlEmp = `SELECT * FROM employee WHERE role_id = ? OR role_id = ?;`;
                db.query(sqlEmp, roleArr, (err, responseEmp) => {
                    if (err) throw err;
                    console.log(``);
                    console.log(`                     ` + 'Employees By Department');
                    console.log(`========================================================`)
                    console.table(responseEmp);
                    console.log(`========================================================`);
                    initialPrompt();
                })
            })
        })
    }); 
};

// View total salary cost of department
const salaryDept = () => {
    const deptArr = [];
    
    // Query to get departments
    const sqlDept = `SELECT * FROM department;`;
    db.query(sqlDept, (err, response) => {
        if (err) throw err;
        response.forEach((department) => deptArr.push(department.name));
        inquirer.prompt([
            {
                type: 'list',
                name: 'deptData',
                message: "Which department would you like to see the total salary cost for?",
                choices: deptArr
            }
        ])
        .then(result => {
            let deptID;
            let roleArr = [];
            
            // Gets department id
            response.forEach((department) => {
                if (result.deptData === department.name) {
                    deptID = department.id;
                }
            })

            // Query to get roles associate with department ID
            const sqlRole = `SELECT * FROM role WHERE department_id = ?;`;
            db.query(sqlRole, deptID, (err, responseRole) => {
                if (err) throw err;
                // Loops through roles and pushes ids to array
                responseRole.forEach((role) => roleArr.push(role.id));
                
                // Query to get total salary
                const sql = `SELECT SUM(salary) AS total_salary_cost FROM role WHERE id = ? OR id = ?;`;
                db.query(sql, roleArr, (err, result) => {
                    if (err) throw err;
                    console.log(``);
                    console.log(`                     ` + 'Total Salary From Department');
                    console.log(`========================================================`)
                    console.table(result);
                    console.log(`========================================================`);
                    initialPrompt();
                })  
            })
        })
    });
};

// Adds new employee
const addEmployee = () => {
  const sqlR = `SELECT * FROM role;`;
  const roleArr = [];

  // Gets all current roles and pushes to roleArr
  db.query(sqlR, (err, roleData) => {
      if (err) throw err;
      roleData.forEach((role) => roleArr.push(role.title));
  })

    return inquirer.prompt([
        {
            type: 'input',
            name: 'addFirstName',
            message: "Please enter new employee's first name.",
            validate: firstNameInput => {
                if (firstNameInput) {
                    if (firstNameInput.charAt(0) === firstNameInput.charAt(0).toUpperCase()) {
                        return true;
                    } else {
                        console.log("  Please capitalize the first name.");
                        return false
                    }
                } else {
                    console.log("  You must enter the first name of the new employee.")
                    return false
                }
            }
        },
        {
            type: 'input',
            name: 'addLastName',
            message: "Please enter new employee's last name.",
            validate: lastNameInput => {
                if (lastNameInput) {
                    if (lastNameInput.charAt(0) === lastNameInput.charAt(0).toUpperCase()) {
                        return true;
                    } else {
                        console.log("  Please capitalize the last name.");
                        return false
                    }
                } else {
                    console.log("  You must enter the last name of the new employee.")
                    return false
                }
            }
        },
        {
            type: 'list',
            name: 'roleSelect',
            message: "Please select new employee's role.",
            choices: roleArr
        },
    ])
    .then(response => {
        const mgrArr = [];
        const roleResponse = response.roleSelect;
        let roleId;
        let mgrId;
      
        const sqlRole = `SELECT * FROM role;`

        // Query to find role id
        db.query(sqlRole, (err, result) => {
            if (err) throw err;

            // Loops through roles to find matching id
            result.forEach((role) => {
                if (roleResponse === role.title) {
                    roleId = role.id
                }
            })

            // To get employee data to use for selection of employee's manager
            sqlMgr = `SELECT * FROM employee;`;
            db.query(sqlMgr, (err, mgrData) => {
                if (err) throw err;
                const mgr = mgrData.map(({ first_name, last_name }) => 
                ({ name: first_name + ' ' + last_name}));

                // Mgr question
                return inquirer.prompt([
                    {
                        type: 'list',
                        name: 'mgrSelect',
                        message: "Please select new employee's manager.",
                        choices: mgr
                    }
                ])
                .then(mgrResult => {
                    const mgrResponse = mgrResult.mgrSelect;
                
                    // Gets the first and last name from the manager response to use to find the id
                    firstName = mgrResponse.split(' ')[0];
                    lastName = mgrResponse.split(' ').pop();
                

                    // Loops through employees to find ID based on the first name and last name
                    mgrData.forEach((employee) => {
                        if ((firstName === employee.first_name) && (lastName === employee.last_name)) {
                            mgrId = employee.id;
                        }
                    })
                
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                 VALUES (?,?,?,?)`;
                    const params = [response.addFirstName, response.addLastName, roleId, mgrId];
      
                    // Query to add employee
                    db.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log("New employee added successfully!")
                        initialPrompt();
                    })
                })
            })
        })   
    });
};

// Deletes an employee
const deleteEmployee = () => {
    const employeeArr = [];
    let employeeID;

    // Query to get employees
    const sqlEmployee = `SELECT * FROM employee;`
    db.query(sqlEmployee, (err, empData) => {
        if (err) throw err;
        // Loop to get employee name and push to array
        empData.forEach((employee) => employeeArr.push(employee.first_name + ' ' + employee.last_name));

        return inquirer.prompt([
            {
                type: 'list',
                name: 'empDelete',
                message: "Which employee would you like to delete?",
                choices: employeeArr
            }
        ])
        .then(response => {
            // Gets the first and last name from the employee response to use to find the id
            let firstName = (response.empDelete).split(' ')[0];
            let lastName = (response.empDelete).split(' ').pop();

            // Loops through employees to find ID based on the first name and last name
            empData.forEach((employee) => {
                if ((firstName === employee.first_name) && (lastName === employee.last_name)) {
                    employeeID = employee.id;
                }
            })

            // Query to delete employee
            const sql = `DELETE FROM employee WHERE id = ?;`
            db.query(sql, employeeID, (err, result) => {
                if (err) throw err;
                console.log("Employee deleted.")
                initialPrompt();
            })
        })
    });
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

// Delete a department
const deleteDepartment = () => {
    const departmentArr = [];
    let deptID;
    let sqlDept = `SELECT * FROM department;`;

    // Gets all current departments and pushes to deptArr
    db.query(sqlDept, (err, deptData) => {
        if (err) throw err;
        deptData.forEach((department) => departmentArr.push(department.name));

        return inquirer.prompt([
            {
                type: 'list',
                name: 'deleteDept',
                message: "Which department would you like to delete?", 
                choices: departmentArr
            },
        ])
        .then(response => {
            // Loops through departments to find the matching ID
            deptData.forEach((department) => {
                if (response.deleteDept === department.name) {
                    deptID = department.id;
                }
            })
            
            // Query to delete the department
            const sql = `DELETE FROM department WHERE id = ?`;
            db.query(sql, deptID, (err, result) => {
                if (err) throw err;
                console.log('Department deleted.')
                initialPrompt();
                }) 
        });
    });
};

// Adds new role
const addRole = () => {
    const sql = `SELECT * FROM department;`
    const departmentArr = [];

    // Gets all current departments and pushes to deptArr
    db.query(sql, (err, roleData) => {
        if (err) throw error;
        roleData.forEach((department) => departmentArr.push(department.name));
    })
    return inquirer.prompt([
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
        let deptID;
        const sqlID = `SELECT * FROM department;`

        // Query to find department ID
        db.query(sqlID, (err, result) => {
            if (err) throw err;

            // Loops through departments to find the matching ID
            result.forEach((department) => {
                if (responseDept === department.name) {
                    deptID = department.id;
                }
            })

            const sql = `INSERT INTO role (title, salary, department_id) 
                        VALUES (?,?,?)`;
            const params = [response.addRoleName, response.addRoleSalary, deptID];
                
            // Query to add data to table
            db.query(sql, params, (err, results) => {
                if (err) throw err;
                console.log('New role added successfully!');
                initialPrompt();
            })
        })
    });
};

// Deletes a role
const deleteRole = () => {
    const roleArr = [];
    let roleID;

    // Query to get roles
    const sqlRole = `SELECT * FROM role;`;

    db.query(sqlRole, (err, response) => {
        if (err) throw err;
        response.forEach((role) => roleArr.push(role.title))

        inquirer.prompt([
            {
                type: 'list',
                name: 'roleSelect',
                message: "Which role would you like to delete?",
                choices: roleArr
            }
        ])
        .then(result => {
            const roleResponse = result.roleSelect;

            // Loops through roles to find matching id
            response.forEach((role) => {
                if (roleResponse === role.title) {
                    roleID = role.id
                }
            })

            // Query to delete role
            const sql = `DELETE FROM role WHERE id = ?;`
            db.query(sql, roleID, (err, result) => {
                if (err) throw err;
                console.log("Role has been deleted")
                initialPrompt();
            })
        })
    });
};

// Updates employee role
const updateRole = () => {
    const employeeArr = [];
    const roleArr = [];
    let employeeID;
    let roleID;

    // Queries to get employees and roles and add to respective arrays
    const sqlEmployee = `SELECT * FROM employee;`;
    const sqlRole = `SELECT * FROM role;`;

    // Employee query
    db.query(sqlEmployee, (err, empData) => {
        if (err) throw err;
        empData.forEach((employee) => employeeArr.push(employee.first_name + ' ' + employee.last_name));

        // Role query
        db.query(sqlRole, (err, roleData) => {
            if (err) throw err;
            roleData.forEach((role) => roleArr.push(role.title));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeSelect',
                    message: "Which employee's role would you like to update?",
                    choices: employeeArr
                },
                {
                    type: 'list',
                    name: 'roleSelect',
                    message: "What would you like to change the employee's role to?",
                    choices: roleArr
                }
            ])
            .then(responseData => {
                const roleResponse = responseData.roleSelect;
                const employeeResponse = responseData.employeeSelect;
    
                // Gets the first and last name from the employee response to use to find the id
                let firstName = employeeResponse.split(' ')[0];
                let lastName = employeeResponse.split(' ').pop();
    
                // Loops through employees to find ID based on the first name and last name
                empData.forEach((employee) => {
                    if ((firstName === employee.first_name) && (lastName === employee.last_name)) {
                        employeeID = employee.id;
                    }
                })
                
                // Loops through roles to find matching id
                roleData.forEach((role) => {
                    if (roleResponse === role.title) {
                        roleID = role.id
                    }
                })

                // Query to update employee's role
                const sql = `UPDATE employee SET role_id = ?
                            WHERE id = ?`;
                const params = [roleID, employeeID];

                db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("Employee role updated successfully!");
                    initialPrompt();
                })
            })
        })          
    });  
};

// Update employee's manager
const updateManager = () => {
    const employeeArr = [];
    
    // Query to get employees
    const sqlEmployee = `SELECT * FROM employee;`;

    // Employee query
    db.query(sqlEmployee, (err, empData) => {
        if (err) throw err;
        empData.forEach((employee) => employeeArr.push(employee.first_name + ' ' + employee.last_name));
        
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeSelect',
                message: "Which employee's manager would you like to update?",
                choices: employeeArr
            },
        ])
        .then(empResponse => {
            let nameSelect = empResponse.employeeSelect;
            const mgrArr = employeeArr.filter(employee => employee !== nameSelect)
            
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'mgrSelect',
                    message: "Who is the employee's new manager?",
                    choices: mgrArr
                }
            ])
            .then(response => {
                let employeeID;
                let mgrID;

                let firstNameEmp = (empResponse.employeeSelect).split(' ')[0];
                let lastNameEmp = (empResponse.employeeSelect).split(' ').pop();
                let firstNameMgr = (response.mgrSelect).split(' ')[0];
                let lastNameMgr = (response.mgrSelect).split(' ').pop();

                // Gets employee's id
                empData.forEach((employee) => {
                    if ((firstNameEmp === employee.first_name) && (lastNameEmp === employee.last_name)) {
                        employeeID = employee.id;
                    }
                })

                // Gets new manager's id
                empData.forEach((employee) => {
                    if ((firstNameMgr === employee.first_name) && (lastNameMgr === employee.last_name)) {
                        mgrID = employee.id;
                    }
                })

                // Query to update manager
                const sql = `UPDATE employee SET manager_id = ?
                            WHERE id = ?;`;
                const params = [mgrID, employeeID]
                db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("Employee manager updated!")
                    initialPrompt()
                })
            })
        })
    });           
};

initialPrompt();