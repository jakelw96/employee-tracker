const db = require('../../db/connection');
const cTable = require('console.table');

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
        console.log((``), (``));
        console.log(`                     ` + 'All employees');
        console.log(`========================================================`)
        console.table((result), (` `));
        console.log(``);
        console.log(``);
        console.log(``)
        console.log(``);
    });
};

module.exports = viewAllEmployees

 





