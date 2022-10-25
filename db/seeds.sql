INSERT INTO department (name)
VALUES  ('it'),
        ('sales'),
        ('Administration');

INSERT INTO role (title, salary, department_id)
VALUES  ("engineer", 50, 1),
        ("intern", 0, 1),
        ("salesperson", 25, 2),
        ("manager", 100, 3),
        ("admin", 40, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Clancy", "Brown", 4, NULL ),
        ("Bob", "Dole", 1, 4 ),
        ('Stan', "TheMan", 2, 4),
        ("Clay", "Shaw", 3, 4);