-- insert into EMPLOYEES(name, contact, email) VALUES('Samir Tamang', '9800000000', 'samir@gmail.com');
-- insert into EMPLOYEES(name, contact, email) VALUES('Dipesh Khatri', '9800000000', 'dipesh@gmail.com');
-- insert into EMPLOYEES(name, contact, email) VALUES('Pravin Karki', '9800000000', 'pk@gmail.com');
-- insert into EMPLOYEES(name, contact, email) VALUES('Utsav Bhai', '9800000000', 'utsav@gmail.com');
-- insert into EMPLOYEES(name, contact, email) VALUES('Ajit Singh', '9800000000', 'ajt@gmail.com');

insert into EVENTS()
select employees.id, employees.name from assignments right join events on assignments.event_id = events.id right join employees on assignments.emp_id = employees.id where assignments.id = 1;
-- insert into ASSIGNMENTS(emp_id, event_id) VALUES (1, 1);