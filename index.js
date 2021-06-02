const inquirer = require('inquirer');
const db = require('./db/connection');
const viewAllEmployees = require('./lib/getData/index');


// Connect to database
db.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
});

//Initial options at start of application
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
            initialPrompt();
        } else if (answer === 'Exit') {
            db.end();
        }
    });
};



initialPrompt();