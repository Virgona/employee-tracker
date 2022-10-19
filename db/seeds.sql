INSERT INTO department (name)
VALUES ('IT');

INSERT INTO role (title, salary, department_id)
VALUES  ("Back End Developer", 50, 1),
        ("Front End Dev", 50, 1),
        ("Helpdesk", 25, 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Bob", "Dole", 1),
        ('Stan', "TheMan", 2),
        ("Clay", "Shaw", 3)