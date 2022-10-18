DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
);

-- CREATE TABLE employee (
--     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
--     first_name VARCHAR(30),
--     last_name VARCHAR(30),
--     FOREIGN KEY (role_id)
--     REFERENCES role(id)
--     DELETE SET ON NULL
-- );