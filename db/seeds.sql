INSERT INTO department (name)
VALUES  ('it'),
        ('sales');
        -- ('managment');

INSERT INTO role (title, salary, department_id)
VALUES  ("engineer", 50, 1),
        ("intern", 0, 1),
        ("salesperson", 25, 2);
        -- ("manager", 100, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Bob", "Dole", 1),
        ('Stan', "TheMan", 2),
        ("Clay", "Shaw", 3);
        -- ("Clancy", "Brown", 4, NULL )