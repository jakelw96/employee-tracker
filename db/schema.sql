DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS employee;

CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER
);

CREATE TABLE role (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    department_id INTEGER
);

CREATE TABLE department (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- All employees

-- SELECT employee.id, employee.first_name, employee.last_name, 
-- role.title AS title, 
-- department.name AS department, role.salary,
-- CONCAT(manager.first_name, ' ', manager.last_name) AS manager
-- FROM employee
-- LEFT JOIN (employee manager) ON manager.id = employee.manager_id
-- LEFT JOIN role on employee.role_id = role.id
-- LEFT JOIN department ON department.id = role.department_id;

-- All Departments
-- SELECT * FROM department;

-- All roles
-- SELECT * FROM role;



