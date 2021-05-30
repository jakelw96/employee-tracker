INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Bob', 'Smith', 7, NULL),
('Tim', 'Anderson', 6, NULL),
('Ray', 'Tummer', 5, 2),
('Tom', 'Hardy', 1, 5),
('Ted', 'Hunter', 2, NULL),
('Sharon', 'Marie', 4, NULL),
('Thanos', 'Eternal', 3, 4),
('Steve', 'Rogers', 8, 9),
('Tony', 'Stark', 9, NULL),
('Sam', 'Winchester', 10, NULL),
('Dean', 'Winchester', 11, 10);

INSERT INTO role (title, salary, department_id)
VALUES
('Salesperson', '50000', 1),
('Sales Lead', '70000', 1),
('Software Engineer', '90000', 2),
('Software Engineer Lead', '120000', 2),
('Generalist', '60000', 3),
('Team Leader', '80000', 3),
('Benefits Coordinator', '80000', 3),
('Accountant', '40000', 4),
('Bookkeeper', '50000', 4),
('Lawyer', '150000', 5),
('Paralegal', '40000', 5);


INSERT INTO department (name)
VALUES
('Sales'),
('Engineering'),
('Human Resources'),
('Finance'),
('Legal');