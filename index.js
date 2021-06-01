const inquirer = require('inquirer');
const db = require('./db/connection');

// Connect to database
db.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
});

const sql = `SELECT * FROM employee;`

const data = db.query(sql, (err, result) => {
    if (err) {
        throw err;
    }
    return result
});
console.log(data)

// const cTable = require('console.table');
// console.table([
//     {
//         name: 'foo',
//         age: 10
//     },
//     {
//         name: 'bar',
//         age: 20
//     }
// ]);

// Initial options at start of application
const initialPrompt = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: '1stPrompt',
            message: "What would you like to do?",
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role']
        }
    ]);
};



//initialPrompt();