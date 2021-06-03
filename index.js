const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');
const { registerPrompt } = require('inquirer');

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
             addEmployee()
        } else if (answer === 'Update An Employee Role') {
            // updateRole()
        } else if (answer === 'Exit') {
            db.end();
        }
    });
};

// Gets all employee data from database
const viewAllEmployees = () => {
    // const sql = `SELECT employee.id, employee.first_name, employee.last_name,
    //             role.title AS title,
    //             department.name AS department, role.salary,
    //             CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    //             FROM employee
    //             LEFT JOIN (employee manager) ON manager.id = employee.manager_id
    //             LEFT JOIN role on employee.role_id = role.id
    //             LEFT JOIN department ON department.id = role.department_id;`

    const sql = `SELECT * FROM employee;`

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

const employeeArr = [];
const roleArr = [];
const departmentArr = [];

// Adds new employee
const addEmployee = () => {
  const sqlR = `SELECT * FROM role;`;
  const sqlE = `SELECT * FROM employee;`;
  
  // Gets all current roles and pushes to roleArr
  db.query(sqlR, (err, roleData) => {
      if (err) throw err;
      roleData.forEach((role) => roleArr.push(role.title));
      roleData.forEach
  })

  // Gets all current employees and pushes to employeeArr
  db.query(sqlE, (err, empData) => {
      if (err) throw err;
      empData.forEach((employee) => employeeArr.push(employee.first_name + ' ' + employee.last_name));
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
      {
          type: 'list',
          name: 'mgrSelect',
          message: "Please choose employee's manager.",
          choices: employeeArr
      }
  ])
  .then(response => {
      const roleResponse = response.roleSelect;
      const mgrResponse = response.mgrSelect;
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
      

          const sqlMgr = `SELECT * FROM employee;`

          // Query to find employee id
          db.query(sqlMgr, (err, result) => {
            if (err) throw err;

            // Loops through employees to find matching id
            result.forEach((employee) => {
                if (mgrResponse === (employee.first_name + ' ' + employee.last_name)) {
                    mgrId = employee.id
                }
            })
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

// Adds new role
const addRole = () => {
    const sql = `SELECT * FROM department;`

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

// Updates employee role
const updateRole = () => {

};

initialPrompt();